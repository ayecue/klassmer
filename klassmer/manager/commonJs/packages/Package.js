/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var fs = require('fs'),
    Klass = require('node-klass'),
    JSON2 = require('JSON2'),
    CONSTANTS = require('../../../constants');

module.exports = Klass.define('Klassmer.Manager.CommonJs.Packages.Package',{
    requires: [
        'Klassmer.Manager.CommonJs.Packages.Package.Autoloader',
        'Klassmer.Manager.CommonJs.Packages.Package.Module',
        'Klassmer.Manager.CommonJs.Packages.Package.Map',
        'Klassmer.Finder'
    ],
    statics : {
        read : function(packagePath){
            var me = this;

            if (packagePath && fs.statSync(packagePath).isFile()) {
                return JSON2.parse(fs.readFileSync(packagePath,{
                    encoding : CONSTANTS.READ.ENCODING,
                    flag : CONSTANTS.READ.FLAG
                }));
            }
        }
    },
    constructor : function(scope,options){
        var me = this;

        me
            .extend({
                scope : scope,
                options : options || {},
                map : new Klassmer.Manager.CommonJs.Packages.Package.Map(),
                autoloader : new Klassmer.Manager.CommonJs.Packages.Package.Autoloader(me,scope.getConfig().excludes)
            }).extend({
                main : me.try(me.get('main'),me.get('name'))
            });

        scope.addToMap(me);
    },
    getGenerator : function(){
        return this.scope.getGenerator();
    },
    getParser : function(){
        return this.scope.getParser();
    },
    getCompiler : function(){
        return this.scope.getCompiler();
    },
    findPackage : function(name){
        return this.scope.findPackage(name);
    },
    addToMap : function(module){
        this.map.add(module);
        return this;
    },
    findModule : function(modulePath){
        return this.scope.findModule(modulePath);
    },
    allModules : function(){
        return this.map.all();
    },
    try : function(modulePath,name){
        return this.getScope().getMap().findModule(modulePath) || this.create(modulePath,name);
    },
    create : function(modulePath,name){
        var me = this,
            module = new Klassmer.Manager.CommonJs.Packages.Package.Module(modulePath,name,me);
        me.scope.getCompiler().register(module);
        return module;
    },
    get : function(property){
        return this.options[property];
    },
    find : function(){
        this.main.parse().find();
        return this;
    },
    load : function(){
        this.main.load();
        return this;
    }
});