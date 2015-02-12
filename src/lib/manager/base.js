/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var Klass = require('../klass'),
	Listener = require('../generic/listener'),
	Event = require('../traits/event'),
	CONSTANTS = require('../constants');

Klass.define('manager.Base',{
	statics : {
		type : 'none'
	},
	traits : [
		'traits.Event'
	],
	constructor : function(){
		this.extend({
			listener : new Listener()
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

module.exports = Klass.get('manager.Base');