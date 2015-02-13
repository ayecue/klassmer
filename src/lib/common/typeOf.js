/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

module.exports = function(x){
	if (x === null || x === undefined) {
		return typeof x;
	}
    var c = x.constructor,
    	name = c.name || (/function ([^\(]+)/i.exec(c.toString()) && (c.name = RegExp.$1));
    return name ? name.toLowerCase() : typeof x;
};