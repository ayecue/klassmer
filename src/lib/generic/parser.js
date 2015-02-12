/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var fs = require('fs'),
	printf = require('../common/printf'),
	uglifyjs = require('uglify-js'),
	Klass = require('../klass'),
	CONSTANTS = require('../constants');

Klass.define('generic.Parser',{
	process : function(code,data){
		return printf(code,data);
	},
	convert : function(node){
		var me = this,
			stream = uglifyjs.OutputStream(me.optimizer);

		node.print(stream);

		return stream.toString();
	}
});

module.exports = Klass.get('generic.Parser');