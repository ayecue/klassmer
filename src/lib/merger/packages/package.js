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
    CONSTANTS = require('../../constants');

function Package(scope,options){
	var me = this;

    me.scope = scope;
    me.options = options || {};
    me.autoloader = new Autoloader(me,scope.getConfig().excludes);
    me.main = me.add(me.get('main'),me.get('name'));
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
        return this.scope.getMap();
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
    add : function(modulePath,name){
        return this.getMap().find(modulePath) || new Module(modulePath,name,this);
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