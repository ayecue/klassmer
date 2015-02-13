/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var forEach = require('./forEach');

/**
 *	Create namespace
 */
module.exports = function(id,value,root,delimiter){
	var namespaces = id.split(delimiter || '.'),
		last = namespaces.pop();

	return forEach(namespaces,function(index,value){
		this.result = this.result[value] || (this.result[value] = {});
	},root)[last] = value || {};
};