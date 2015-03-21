/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var Klass = require('node-klass'),
    forEach = Klass.forEach,
    indexOf = Klass.indexOf,
    CONSTANTS = require('../../../../constants');

module.exports = Klass.define('Klassmer.Manager.CommonJs.Packages.Package.Map',{
    extends : 'Klassmer.Generic.Map',
    indexOf : function(modulePath){
        var me = this;

        return indexOf(me.collection,function(module){
            return module.getModulePath() === modulePath;
        });
    },
    find : function(modulePath){
        var me = this,
            idx = me.indexOf(modulePath);

        if (idx !== -1) {
            return me.collection[idx];
        }

        return null;
    }
});