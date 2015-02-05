/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var Generator = require('./generator'),
    $Map = require('./map'),
    Module = require('./module'),
    CONSTANTS = require('./constants');

function Factory(parser){
	var me = this;

    me.map = new $Map();
    me.generator = new Generator(CONSTANTS.GENERATOR.MODULE);
    me.parser = parser;
}

Factory.prototype = {
	self : Factory,
    create : function(modulePath,basedir,name){
        return this.map.find(modulePath) || new Module(modulePath,basedir,name,this);
    },
    getParser : function(){
        return this.parser;
    },
    getGenerator : function(){
        return this.generator;
    },
    getMap : function(){
        return this.map;
    }
};

module.exports = Factory;