/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var printf = require('./common/printf'),
    Base = require('./manager/base'),
    CommonJs = require('./manager/commonjs'),
    Klass = require('./klass'),
    CONSTANTS = require('./constants');

Klass.define('Manager',{
    singleton : true,
    statics : {
        types : {
            none : Klass.get('manager.Base'),
            commonjs : Klass.get('manager.CommonJs')
        }
    },
    get : function(type,options){
        var me = this,
            $class = me.getClass();

        type = type in $class.types ? type : CONSTANTS.TYPES.DEFAULT;

        if (type in $class.types) {
            return new $class.types[type](options);
        }
    }
});

module.exports = Klass.get('Manager');