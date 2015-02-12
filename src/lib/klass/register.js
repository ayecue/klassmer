/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var extend = require('../common/extend'),
	forEach = require('../common/forEach'),
	regNs = require('../common/regNs'),
	global = require('./global');

module.exports = function(handle){
	regNs(handle.getName(),handle.singleton ? new handle() : handle,global);
};