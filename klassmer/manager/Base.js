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

module.exports = Klass.define('Klassmer.Manager.Base',{
	requires: [
        'Klassmer.Generic.Listener'
    ],
	statics : {
		type : 'none'
	},
	mixins : {
        ev: 'Klassmer.Mixins.Event'
    },
	constructor : function(){
		this.extend({
			listener : new Klassmer.Generic.Listener()
		});
	},
	find : function(){

	},
	load : function(){

	},
	sort : function(){

	},
	toString : function(){
		
	}
});