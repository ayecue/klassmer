/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var CONSTANTS = require('../constants');

function Generator(prefix,index){
	var me = this;

	me.prefix = prefix || CONSTANTS.ID.PREFIX;
	me.index = index || CONSTANTS.ID.DEFAULT;
}

Generator.prototype = {
	self : Generator,
	get : function(){
		return this.prefix + (this.index++);
	},
	reset : function(){
		this.index = CONSTANTS.ID.DEFAULT;
	}
};

module.exports = Generator;