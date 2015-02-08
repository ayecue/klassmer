/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var CONSTANTS = require('../../../constants');

function Manipulator(){
}

Manipulator.prototype = {
    self : Manipulator,
    removeLastDirectory : function(dir) {
        return dir.replace(CONSTANTS.AUTOLOADER.LAST_DIR,'');
    },
    relativeUp : function(target,dir) {
        return target.replace(CONSTANTS.AUTOLOADER.RELATIVE_BACK,dir + '/');
    },
    relative : function(target,dir){
        return target.replace(CONSTANTS.AUTOLOADER.RELATIVE,dir + '/');
    },
    extension : function(target){
        if (CONSTANTS.AUTOLOADER.EXTENSION.test(target)) {
            return target;
        }
        return [target,'js'].join('.');
    },
    isEmpty : function(target){
        return CONSTANTS.AUTOLOADER.EMPTY.test(target);
    }
};

module.exports = new Manipulator();