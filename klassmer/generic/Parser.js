/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var fs = require('fs'),
	Klass = require('node-klass'),
	printf = Klass.printf,
	uglifyjs = require('uglify-js'),
	CONSTANTS = require('../constants');

module.exports = Klass.define('Klassmer.Generic.Parser',{
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