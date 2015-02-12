/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var forEach = require('../common/forEach'),
	printf = require('../common/printf'),
	CONSTANTS = require('../constants');

/**
 *	Shortcuts
 */
module.exports = function(name){
	var property = forEach(name.split('.'),function(_,name){
			this.result.push(printf('<%=:capitalise:name%>','name',name));
		},[]).join(''),
		constructor = printf(CONSTANTS.KLASS.TEMPLATE,'name',property);

	try {
		return new Function(constructor)();
	} catch(e) {
		throw Error(printf(CONSTANTS.ERRORS.EVAL,{
			code : constructor,
			message : e.message
		}));
	}
}