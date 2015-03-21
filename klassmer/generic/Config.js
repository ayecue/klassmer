/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var Klass = require('node-klass'),
    toArray = Klass.toArray,
    applyIf = Klass.applyIf,
    CONSTANTS = require('../constants');

module.exports = Klass.define('Klassmer.Generic.Config',{
    constructor : function(options){
        this.applyIf({
            options : options
        },options);
    },
    applyIf : function(){
        var args = toArray(arguments);
        applyIf.apply(null,[this].concat(args));
    },
    validate : function(){
        throw Error(CONSTANS.ERRORS.CONFIG_VALIDATE_EMPTY);
    }
});