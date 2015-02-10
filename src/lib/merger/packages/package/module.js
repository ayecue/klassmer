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
    Listener = require('../../../generic/listener'),
    CJSParser = require('./module/cjsparser'),
    CONSTANTS = require('../../../constants');

function Module(modulePath,name,pkg){
    var me = this;

    me.id = name || pkg.getGenerator().get();
    me.modulePath = modulePath;
    me.dependencies = new Dependencies();
    me.basedir = path.dirname(pkg.get('main'));
    me.listener = new Listener();
    me.pkg = pkg;
    me.parsed = null;
    me.batch = null;
    me.loaded = false;

    pkg.addToMap(me);
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
        me.listener.fire('parse',me,[me.parsed]);
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
            deps = CJSParser.findRequires(requires,function(to){
                return me.pkg.getAutoloader().get(me.modulePath,to);
            });

        me.dependencies.add.apply(me.dependencies,deps);
        me.listener.fire('find',me,[me.batch]);

        return me;
    },
    load : function(force){
        var me = this;

        if (me.loaded && !force) {
            return me.loaded;
        }

        me.listener.fire('load',me,[me.dependencies]);

        return me.loaded = me.dependencies.each(function(dep){
            var modulePath = dep.modulePath,
                module = me.pkg.findModule(modulePath),
                result;

            if (!fs.statSync(modulePath).isFile()) {
                throw new Error(printf(CONSTANTS.ERRORS.MODULE_LOAD,'modulePath',modulePath));
            }

            if (!me.pkg.getScope().getMap().isCyclic()) {
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

            var module = me.pkg.findModule(dep.modulePath);

            CJSParser.replaceVariables(allScopes,dep.name,module.getId());
        });

        /**
         *  Remove require vardefs
         */
        CJSParser.removeRequires(requires,function(modulePath){
            return me.pkg.findModule(modulePath);
        });

        if (exports.isEmpty()) {
            CJSParser.replaceModuleExport(moduleExport);
        } else {
            CJSParser.injectExportVariable(mainScope);
        }

        me.listener.fire('compile',me,[me.parsed]);

        return me.pkg.getParser().toString(me.parsed);
    }
};

module.exports = Module;