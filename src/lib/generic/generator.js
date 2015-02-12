/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var Klass = require('../klass'),
	CONSTANTS = require('../constants');

Klass.define('generic.Generator',{
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

module.exports = Klass.get('generic.Generator');