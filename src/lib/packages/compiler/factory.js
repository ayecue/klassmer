/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var extend = require('../../common/extend');

module.exports = function Factory(object){
    var compiler = function(scope){
    	var me = this;
    	me.compiler = scope;
    };

    extend(compiler.prototype,{
    	self : compiler,
        getConfig : function(){return [];},
        onFind : function(){},
        onLoad : function(){},
        onCompile : function(){}
    },object);

	return compiler;
};