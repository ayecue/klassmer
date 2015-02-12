/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var Klass = require('../klass'),
    CONSTANTS = require('../constants');

Klass.define('layout.Node',{
    constructor : function(id,links,data){
        this.extend({
            id : id || CONSTANTS.LAYOUT.UNKNOWN,
            links : links,
            data : data
        });
    }
})

module.exports = Klass.get('layout.Node');