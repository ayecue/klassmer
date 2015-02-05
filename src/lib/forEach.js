/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

module.exports = function(obj,callback,pre){
	if (obj == null) {
		return pre;
	}

	var k, t, d = {
		result:pre,
		skip:false
	};

	if (t = obj.length) {
		for (k = 0; k < t && !d.skip;) {
			callback.call(d,k,obj[k++]);
		}                                
	} else {
		for (k in obj) {
			if (typeof obj[k] !== 'unknown') {
				callback.call(d,k, obj[k]);
			}
	
			if (d.skip) {
				break;
			}
		}
	}
	
	return d.result;
};