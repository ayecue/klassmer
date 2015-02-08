/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var fs = require('fs'),
    uglifyjs = require('uglify-js'),
    path = require('path'),
    printf = require('../../../common/printf'),
    typeOf = require('../../../common/typeOf'),
    forEach = require('../../../common/forEach'),
    finder = require('./finder'),
    indexOf = require('../../../common/indexOf'),
    Dependencies = require('./module/dependencies'),
    CONSTANTS = require('../../../constants');

function Module(modulePath,name,pkg){
    var me = this;

    me.id = name || pkg.getGenerator().get();
    me.modulePath = modulePath;
    me.dependencies = new Dependencies();
    me.basedir = path.dirname(pkg.get('main'));
    me.pkg = pkg;
    me.parsed = null;
    me.batch = null;

    pkg.getMap().add(me);
}

Module.prototype = {
    self : Module,
    getId : function(){
        return this.id;
    },
    getDependencies : function(){
        return this.dependencies;
    },
    getModulePath : function(){
        return this.modulePath;
    },
    getBasedir : function(){
        return this.basedir;
    },
    parse : function(force){
        var me = this;

        if (me.parsed && !force) {
            return me;
        }
        
        me.parsed = me.pkg.getParser().parse(me.id,me.modulePath);
        me.parsed.figure_out_scope();
        return me;
    },
    find : function(force){
        var me = this;

        if (me.batch && !force) {
            return me;
        }

        me.batch = finder.find(me.parsed,[{
            type : CONSTANTS.TYPES.CALL,
            resultType : CONSTANTS.SELECTOR.SINGLE
        },{
            type : CONSTANTS.TYPES.FUNCTION,
            resultType : CONSTANTS.SELECTOR.MULTIPLE
        },{
            conditions : {
                'start.value' : 'require'
            },
            type : CONSTANTS.TYPES.CALL,
            resultType : CONSTANTS.SELECTOR.MULTIPLE
        },{
            conditions : {
                'body.left.property' : 'exports',
                'body.operator' : '=',
                'body.left.expression.name' : 'module'
            },
            type : CONSTANTS.TYPES.SIMPLE_STATEMENT,
            resultType : CONSTANTS.SELECTOR.MULTIPLE
        },{
            conditions : {
                'body.operator' : '=',
                'body.left.expression.name' : 'exports'
            },
            type : CONSTANTS.TYPES.SIMPLE_STATEMENT,
            resultType : CONSTANTS.SELECTOR.MULTIPLE
        }]);

        var requires = me.batch.get(CONSTANTS.FINDER.REQUIRES),
            toRemove = [];

        requires.each(function(node){
            if (!node.args[0]) {
                return;
            }

            var module = me.pkg.getAutoloader().get(me.modulePath,node.args[0].value);

            if (!module) {
                return toRemove.push(node);
            }

            var modulePath = module.getModulePath(),
                vardef = node.$prev,
                dep = {
                    modulePath : modulePath,
                    node : node
                };

            if (vardef.TYPE === CONSTANTS.TYPES.VAR_DEF) {
                dep.name = node.$prev.name.name;
                dep.nesting = node.expression.scope.nesting; 
            } else if (vardef.TYPE === CONSTANTS.TYPES.OBJECT_KEY_VAL) {
                node.modulePath = modulePath;
            };

            me.dependencies.add(dep);
        });

        requires.remove.apply(requires,toRemove);

        return me;
    },
    load : function(){
        var me = this;

        return me.dependencies.each(function(dep){
            var modulePath = dep.modulePath,
                module = me.pkg.getMap().find(modulePath),
                result;

            if (!fs.statSync(modulePath).isFile()) {
                throw new Error(printf(CONSTANTS.ERRORS.MODULE_LOAD,'modulePath',modulePath));
            }

            if (!me.pkg.getMap().isCyclic()) {
                result = module
                    .parse()
                    .find()
                    .load();
            }

            if (result === false) {
                this.skip = true;
                this.result = result;
            }
        },true);
    },
    compile : function(){
        var me = this,
            deps = me.getDependencies(),
            mainScope = me.batch.get(CONSTANTS.FINDER.MAIN_SCOPE),
            allScopes = me.batch.get(CONSTANTS.FINDER.ALL_SCOPES),
            requires = me.batch.get(CONSTANTS.FINDER.REQUIRES),
            moduleExport = me.batch.get(CONSTANTS.FINDER.MODULE_EXPORT),
            exports = me.batch.get(CONSTANTS.FINDER.EXPORTS);

        /**
         *  Replace variable ref names
         */
        deps.each(function(dep){
            if (dep.node.$prev.TYPE !== CONSTANTS.TYPES.VAR_DEF) {
                return;
            }

            var module = me.pkg.getMap().find(dep.modulePath),
                id = module.getId();

            allScopes.each(function(scope){
                var variable = scope.find_variable(dep.name);

                if (variable) {
                    variable.name = id;
                }
            });
        });

        /**
         *  Remove require vardefs
         */
        requires.each(function(node){
            var $vardef = node.$prev;

            if ($vardef.TYPE === CONSTANTS.TYPES.VAR_DEF) {
                var $var = $vardef.$prev,
                    definitions = $var.definitions,
                    key = indexOf(definitions,function(def){
                        return def.name.name === $vardef.name.name;
                    });

                if (key !== -1) {
                    definitions.splice(key,1);
                }

                if (definitions.length === 0) {
                    var $scope = $var.$prev,
                        index = indexOf($scope.body,function(expression){
                            return expression && expression.TYPE === CONSTANTS.TYPES.VAR && expression.id === $var.id;
                        });

                    if (index !== -1) {
                        $scope.body[index] = null;
                        delete $scope.body[index];
                    }
                }
            } else if ($vardef.TYPE === CONSTANTS.TYPES.OBJECT_KEY_VAL) {
                var modulePath = node.modulePath,
                    module = me.pkg.getMap().find(modulePath);

                $vardef.value = new uglifyjs.AST_SymbolRef({
                    name : module.getId()
                });
            }
        });

        if (exports.isEmpty()) {
            moduleExport.each(function(node){
                var $scope = node.$prev,
                    key = indexOf($scope.body,function(expression){
                        return expression && expression.TYPE === CONSTANTS.TYPES.SIMPLE_STATEMENT && expression.id === node.id;
                    });

                if (key !== -1) {
                    $scope.body[key] = new uglifyjs.AST_Return({
                        value : node.body.right
                    });
                }
            });
        } else {
            mainScope.each(function(scope){
                var arg = new uglifyjs.AST_Object({
                    properties : []
                    }),
                    argName = new uglifyjs.AST_SymbolFunarg({
                        name : "exports"
                    }),
                    symbolRef = new uglifyjs.AST_SymbolRef({
                        name : "exports"
                    }),
                    bodyReturn = new uglifyjs.AST_Return({
                        value : symbolRef
                    });

                scope.args.push(arg);
                scope.expression.argnames.push(argName);
                scope.expression.body.push(bodyReturn);
            });
        }

        return me.pkg.getParser().toString(me.parsed);
    }
};

module.exports = Module;