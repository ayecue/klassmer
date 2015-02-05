/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var path = require('path'),
    CONSTANTS = require('./constants');

module.exports = function(source,target,basedir){
    var sourceDirectory = path.dirname(source),
        result = [];

    basedir = basedir || sourceDirectory;

    if (target.charAt(0) === '.') {
        if (target.charAt(1) === '.') {
            var dir = sourceDirectory.replace(CONSTANTS.NORMALIZER.LAST_DIR,'');

            result.push(target.replace(CONSTANTS.NORMALIZER.RELATIVE_BACK,dir + '/') + '.js');
        } else {
            result.push(target.replace(CONSTANTS.NORMALIZER.RELATIVE,sourceDirectory + '/') + '.js');
        }
    } else {
        result.push(basedir);
        result.push(target  + '.js');
    }

    return result.join('/');
};