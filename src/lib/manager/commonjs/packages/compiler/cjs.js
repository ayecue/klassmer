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
    indexOf = require('../../../../common/indexOf'),
    Base = require('./base'),
    Klass = require('../../../../klass'),
    CONSTANTS = require('../../../../constants');

Klass.define('manager.commonjs.packages.compiler.CJS',{
    extends : 'manager.commonjs.packages.compiler.Base',
    getConfig : function(){
        return [{
            type : CONSTANTS.AST_TYPES.CALL,
            resultType : CONSTANTS.SELECTOR.SINGLE
        },{
            type : CONSTANTS.AST_TYPES.FUNCTION,
            resultType : CONSTANTS.SELECTOR.MULTIPLE
        },{
            conditions : {
                'start.value' : 'require'
            },
            type : CONSTANTS.AST_TYPES.CALL,
            resultType : CONSTANTS.SELECTOR.MULTIPLE
        },{
            conditions : {
                'body.left.property' : 'exports',
                'body.operator' : '=',
                'body.left.expression.name' : 'module'
            },
            type : CONSTANTS.AST_TYPES.SIMPLE_STATEMENT,
            resultType : CONSTANTS.SELECTOR.MULTIPLE
        },{
            conditions : {
                'body.operator' : '=',
                'body.left.expression.name' : 'exports'
            },
            type : CONSTANTS.AST_TYPES.SIMPLE_STATEMENT,
            resultType : CONSTANTS.SELECTOR.MULTIPLE
        }];
    },
    onFind : function(module,batch){
        var me = this;

        me.findRequires(module);
    },
    onCompile : function(module,parsed){
        var me = this;

        me.replaceVariables(module);
        me.removeRequires(module);

        if (module.getBatch().get(CONSTANTS.CJS_COMPILER.EXPORTS).isEmpty()) {
            me.replaceModuleExport(module);
        } else {
            me.injectExportVariable(module);
        }
    },
    findRequires : function(module){
        module.getBatch().get(CONSTANTS.CJS_COMPILER.REQUIRES).each(function(node){
            if (!node.args[0]) {
                return;
            }
            
            var found = module.getPackage().getAutoloader().get(module.getModulePath(),node.args[0].value);

            if (!found) {
                return;
            }

            var foundPath = found.getModulePath(),
                vardef = node.$prev,
                dep = {
                    modulePath : foundPath,
                    node : node
                };

            if (vardef.TYPE === CONSTANTS.AST_TYPES.VAR_DEF) {
                dep.name = node.$prev.name.name;
                dep.nesting = node.expression.scope.nesting; 
            } else if (vardef.TYPE === CONSTANTS.AST_TYPES.OBJECT_KEY_VAL) {
                node.modulePath = foundPath;
            } else if (vardef.TYPE === CONSTANTS.AST_TYPES.ASSIGN) {
                node.modulePath = foundPath;
            }

            module.getDependencies().add(dep);
        });
    },
    removeRequires : function(module){
        module.getBatch().get(CONSTANTS.CJS_COMPILER.REQUIRES).each(function(node){
            var $vardef = node.$prev;

            if ($vardef.TYPE === CONSTANTS.AST_TYPES.VAR_DEF) {
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
                            return expression && expression.TYPE === CONSTANTS.AST_TYPES.VAR && expression.id === $var.id;
                        });

                    if (index !== -1) {
                        $scope.body[index] = null;
                        delete $scope.body[index];
                    }
                }
            } else if ($vardef.TYPE === CONSTANTS.AST_TYPES.OBJECT_KEY_VAL) {
                var found = module.getPackage().findModule(node.modulePath);

                $vardef.value = new uglifyjs.AST_SymbolRef({
                    name : found.getId()
                });
            } else if ($vardef.TYPE === CONSTANTS.AST_TYPES.ASSIGN) {
                var found = module.getPackage().findModule(node.modulePath);

                $vardef.right = new uglifyjs.AST_SymbolRef({
                    name : found.getId()
                });
            }
        });
    },
    replaceVariables : function(module){
        module.getDependencies().each(function(dep){
            if (dep.node.$prev.TYPE !== CONSTANTS.AST_TYPES.VAR_DEF) {
                return;
            }

            var found = module.getPackage().findModule(dep.modulePath);

            module.getBatch().get(CONSTANTS.CJS_COMPILER.ALL_SCOPES).each(function(scope){
                var variable = scope.find_variable(dep.name);

                if (variable) {
                    variable.name = found.getId();
                }
            });
        });
    },
    replaceModuleExport : function(module){
         module.getBatch().get(CONSTANTS.CJS_COMPILER.MODULE_EXPORT).each(function(node){
            var $scope = node.$prev,
                key = indexOf($scope.body,function(expression){
                    return expression && expression.TYPE === CONSTANTS.AST_TYPES.SIMPLE_STATEMENT && expression.id === node.id;
                });

            if (key !== -1) {
                $scope.body[key] = new uglifyjs.AST_Return({
                    value : node.body.right
                });
            }
        });
    },
    injectExportVariable : function(module){
        module.getBatch().get(CONSTANTS.CJS_COMPILER.MAIN_SCOPE).each(function(scope){
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
});

module.exports = Klass.get('manager.commonjs.packages.compiler.CJS');