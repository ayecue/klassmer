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
    printf = require('../../common/printf'),
    typeOf = require('../../common/typeOf'),
    forEach = require('../../common/forEach'),
    finder = require('./finder'),
    indexOf = require('../../common/indexOf'),
    Dependencies = require('./module/dependencies'),
    Listener = require('../../generic/listener'),
    CONSTANTS = require('../../constants');

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
    getBatch : function(){
        return this.batch;
    },
    getPackage : function(){
        return this.pkg;
    },
    getListener : function(){
        return this.listener;
    },
    parse : function(force){
        var me = this;

        if (me.parsed && !force) {
            return me;
        }
        
        me.parsed = me.pkg.getParser().parse(me.id,me.modulePath);
        me.parsed.figure_out_scope();
        me.listener.fire('parse',me,[me,me.parsed]);
        return me;
    },
    find : function(force){
        var me = this;

        if (me.batch && !force) {
            return me;
        }

        me.batch = finder.find(me.parsed,me.pkg.getCompiler().getConfig() || []);
        me.listener.fire('find',me,[me,me.batch]);

        return me;
    },
    load : function(force){
        var me = this;

        if (me.loaded && !force) {
            return me.loaded;
        }

        me.listener.fire('load',me,[me,me.dependencies]);

        return me.loaded = me.dependencies.each(function(dep){
            var modulePath = dep.modulePath,
                module = me.pkg.findModule(modulePath),
                result;

            if (!fs.statSync(modulePath).isFile()) {
                throw new Error(printf(CONSTANTS.ERRORS.MODULE_LOAD,'modulePath',modulePath));
            }

            if (!me.pkg.getScope().getMap().isCyclic(module)) {
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
        var me = this;
        me.listener.fire('compile',me,[me,me.parsed]);
        return me.pkg.getParser().toString(me.parsed);
    }
};

module.exports = Module;