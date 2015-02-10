/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var fs = require('fs'),

    Autoloader = require('./package/autoloader'),
    Module = require('./package/module'),
    finder = require('./package/finder'),
    JSON2 = require('JSON2'),
    $Map = require('./package/map'),
    CONSTANTS = require('../../constants');

function Package(scope,options){
	var me = this;

    me.scope = scope;
    me.options = options || {};
    me.map = new $Map();
    me.autoloader = new Autoloader(me,scope.getConfig().excludes);
    me.main = me.try(me.get('main'),me.get('name'));

    scope.addToMap(me);
}

Package.read = function(packagePath){
    var me = this;

    if (packagePath && fs.statSync(packagePath).isFile()) {
        return JSON2.parse(fs.readFileSync(packagePath,{
            encoding : CONSTANTS.READ.ENCODING,
            flag : CONSTANTS.READ.FLAG
        }));
    }
};

Package.prototype = {
	self : Package,
    getScope : function(){
        return this.scope;
    },
    getMap : function(){
        return this.map;
    },
    getGenerator : function(){
        return this.scope.getGenerator();
    },
    getParser : function(){
        return this.scope.getParser();
    },
    getAutoloader : function(){
        return this.autoloader;
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
        return new Module(modulePath,name,this);
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
};
    

module.exports = Package;