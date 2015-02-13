/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var forEach = require('./forEach'),
	toArray = require('./toArray'),
	printf = require('./printf'),
	getNs = require('./getNs'),
	CONSTANTS = require('../constants'),
	merge = require('../klass/merge');

/**
 *	Override class
 */
module.exports = function(){
	var args = toArray(arguments),
		id = typeof args[0] == 'string' ? args.shift() : null,
		handle = getNs(id);

	if (handle !== null) {
		forEach(args,function(_,values){
			merge(handle,values);
		});
	} else {
		throw Error(printf(CONSTANTS.ERRORS.NO_KLASS_FOUND,'name',id));
	}

	return handle;
};