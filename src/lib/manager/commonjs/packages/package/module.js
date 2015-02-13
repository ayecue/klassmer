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
    printf = require('../../../../common/printf'),
    typeOf = require('../../../../common/typeOf'),
    forEach = require('../../../../common/forEach'),
    finder = require('../../../../finder'),
    indexOf = require('../../../../common/indexOf'),
    Dependencies = require('./module/dependencies'),
    Listener = require('../../../../generic/listener'),
    Event = require('../../../../traits/event'),
    Klass = require('../../../../klass'),
    CONSTANTS = require('../../../../constants');

Klass.define('manager.commonjs.packages.package.Module',{
    traits : [
        'traits.Event'
    ],
    parsed : null,
    batch : null,
    loaded : false,
    constructor : function(modulePath,name,pkg){
        var me = this;

        me.extend({
            id : name || pkg.getGenerator().get(),
            modulePath : modulePath,
            dependencies : new Dependencies(),
            basedir : path.dirname(pkg.get('main')),
            listener : new Listener(),
            package : pkg
        });

        pkg.addToMap(me);
    },
    parse : function(force){
        var me = this;

        if (me.parsed && !force) {
            return me;
        }
        
        me.parsed = me.package.getParser().parse(me.id,me.modulePath);
        me.parsed.figure_out_scope();
        me.listener.fire('parse',me,[me,me.parsed]);
        return me;
    },
    find : function(force){
        var me = this;

        if (me.batch && !force) {
            return me;
        }

        me.batch = finder.find(me.parsed,me.package.getCompiler().getConfig() || []);
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
                module = me.package.findModule(modulePath),
                result;

            if (!fs.statSync(modulePath).isFile()) {
                throw new Error(printf(CONSTANTS.ERRORS.MODULE_LOAD,'modulePath',modulePath));
            }

            if (!me.package.getScope().getMap().isCyclic(module)) {
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
        return me.package.getParser().convert(me.parsed);
    }
});

module.exports = Klass.get('manager.commonjs.packages.package.Module');