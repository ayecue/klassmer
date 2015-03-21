/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var Klass = require('node-klass'),
	CONSTANTS = require('../constants');

module.exports = Klass.define('Klassmer.Generic.Generator',{
	constructor : function(prefix,index){
		this.extend({
			prefix : prefix || CONSTANTS.ID.PREFIX,
			index : index || CONSTANTS.ID.DEFAULT
		});
	},
	get : function(){
		return this.prefix + (this.index++);
	},
	reset : function(){
		this.index = CONSTANTS.ID.DEFAULT;
	}
});