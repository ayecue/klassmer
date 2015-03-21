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
    Klass = require('node-klass'),
    printf = Klass.printf,
    typeOf = Klass.typeOf,
    forEach = Klass.forEach,
    indexOf = Klass.indexOf,
    CONSTANTS = require('../../../../constants');

module.exports = Klass.define('Klassmer.Manager.CommonJs.Packages.Package.Module',{
    requires: [
        'Klassmer.Manager.CommonJs.Packages.Package.Module.Dependencies',
        'Klassmer.Generic.Listener',
        'Klassmer.Finder'
    ],
    mixins : {
        ev: 'Klassmer.Mixins.Event'
    },
    parsed : null,
    batch : null,
    loaded : false,
    constructor : function(modulePath,name,pkg){
        var me = this;

        me.extend({
            id : name || pkg.getGenerator().get(),
            modulePath : modulePath,
            dependencies : new Klassmer.Manager.CommonJs.Packages.Package.Module.Dependencies(),
            basedir : path.dirname(pkg.get('main')),
            listener : new Klassmer.Generic.Listener(),
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

        me.batch = Klassmer.Finder.find(me.parsed,me.package.getCompiler().getConfig() || []);
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