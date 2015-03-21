/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var Klass = require('node-klass'),
    CONSTANTS = require('../constants');

module.exports = Klass.define('Klassmer.Layout.Node',{
    constructor : function(id,text,links,data){
        this.extend({
            id : id || CONSTANTS.LAYOUT.UNKNOWN,
            text : text,
            links : links,
            data : data
        });
    },
    getRawData : function(){
    	var me = this;

    	return {
    		id : me.id,
            text : me.text,
            links : me.links,
            data : me.data
    	};
    }
});