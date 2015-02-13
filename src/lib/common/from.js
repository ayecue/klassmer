/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var typeOf = require('./typeOf');

module.exports = function(values){
	if (typeOf(values) === "array") {
        return values;
    }
    return [values];
};