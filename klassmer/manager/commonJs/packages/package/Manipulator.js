/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var Klass = require('node-klass'),
    CONSTANTS = require('../../../../constants');

module.exports = Klass.define('Klassmer.Manager.CommonJs.Packages.Package.Manipulator',{
    singleton : true,
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
});