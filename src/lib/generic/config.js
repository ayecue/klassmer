/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var Klass = require('../klass'),
    toArray = require('../common/toArray'),
    applyIf = require('../common/applyIf'),
    CONSTANTS = require('../constants');

Klass.define('generic.Config',{
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

module.exports = Klass.get('generic.Config');