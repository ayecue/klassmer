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
    typeOf = Klass.typeOf,
    extend = Klass.extend,
    toArray = Klass.toArray,
    CONSTANTS = require('../constants');

module.exports = Klass.define('Klassmer.Info.Config',{
    requires: [
        'Klassmer.Generic.Validator'
    ],
    constructor: function(options){
        var me = this;

        me.options = options;
        extend(me,options);
    },
    setSource : function(src){
        this.src = src;
        return this;
    },
    getSource : function(){
        return this.src;
    },
    setOutput : function(out){
        this.out = out;
        return this;
    },
    getOutput : function(){
        return this.out;
    },
    setExcludes : function(excludes){
        this.excludes = excludes;
        return this;
    },
    getExcludes : function(){
        return this.excludes;
    },
    validate : function(){
        var me = this,
            validator = new Klassmer.Generic.Validator(me);

        validator
            .add('src',function(v,c){
                return !!v;
            },CONSTANTS.ERRORS.CONFIG_SRC);

        return me;
    }
});