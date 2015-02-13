/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var printf = require('./printf'),
	CONSTANTS = require('../constants');

/**
 *	Call parent of class
 */
module.exports = function(args,prop){
	var self = this,
		klass = self.getCalledMethodKlass(),
		parent = klass.getParent();

	if (!parent) return;

	var root = parent[prop] || parent,
		name = self.getCalledMethodName();

	if (name in root) return root[name].apply(self,args || []);
	throw new Error(printf(CONSTANTS.ERRORS.NP_PARENT_METHOD,'name',name));
};