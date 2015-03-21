/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var Klass = require('node-klass'),
    printf = Klass.printf,
    extend = Klass.extend,
    CONSTANTS = require('./constants');

module.exports = Klass.define('Klassmer.Manager',{
    singleton : true,
    requires: [
        'Klassmer.Manager.Base',
        'Klassmer.Manager.CommonJs'
    ],
    constructor: function(){
        extend(this,{
            types: {
                none: Klassmer.Manager.Base,
                commonjs: Klassmer.Manager.CommonJs
            }
        });
    },
    get : function(type,options){
        var me = this;

        type = type in me.types ? type : CONSTANTS.TYPES.DEFAULT;

        if (type in me.types) {
            return new me.types[type](options);
        }
    }
});