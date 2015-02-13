/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var forEach = require('./forEach');

module.exports = function(id,root,delimiter){
    var namespaces = id.split(delimiter || '.');

    return forEach(namespaces,function(index,value){
        if (value in this.result) {
            this.result = this.result[value];
        } else {
            this.result = null;
            this.skip = true;
        }
    },root);
};