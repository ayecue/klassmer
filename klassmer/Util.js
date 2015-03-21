/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var Klass = require('node-klass'),
	fs = require('fs'),
    path = require('path'),
    mkdirp = require('mkdirp');

module.exports = Klass.define('Klassmer.Util',{
	singleton: true,
	writeFile: function(file, contents){
		mkdirp.sync(path.dirname(file));
		fs.writeFileSync(file,contents);
	}
});