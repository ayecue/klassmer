/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var Klass = require('node-klass'),
    CONSTANTS = require('../../../constants');

module.exports = Klass.define('Klassmer.Finder.Batch.Stack.Generator',{
    extends: 'Klassmer.Generic.Generator',
    singleton: true,
    constructor : function(){
        this.callParent([CONSTANTS.GENERATOR.STACK]);
    }
});