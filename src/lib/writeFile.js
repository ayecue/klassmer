/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var fs = require('fs'),
    path = require("path"),
    mkdirp = require("mkdirp");

module.exports = function(file, contents) {
	mkdirp.sync(path.dirname(file));
	fs.writeFileSync(file,contents);
};