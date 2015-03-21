/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var Klass = require('node-klass');

module.exports = Klass.define('Klassmer.Manager.CommonJs.Packages.Compiler.Base',{
	constructor : function(scope){
        this.extend({
            compiler : scope
        });
    },
    getConfig : function(){return [];},
    onFind : function(){},
    onLoad : function(){},
    onCompile : function(){}
});