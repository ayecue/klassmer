/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var regNs = require('./common/regNs'),
	getNs = require('./common/getNs'),
	global = require('./klass/global');

module.exports = {
	$scope : global,
	set : function(name,object){
		return regNs(name,object,global);
	},
	get : function(name){
		return getNs(name,global);
	},
	override : require('./common/override'),
	define : require('./klass/factory')
};