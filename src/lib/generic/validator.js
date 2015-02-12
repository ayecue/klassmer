/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var Klass = require('../klass'),
	forEach = require('../common/forEach'),
	typeOf = require('../common/typeOf'),
	getNs = require('../common/getNs');

Klass.define('generic.Validator',{
	fields : [],
	constructor : function(config){
		this.extend({
			config : config
		});
	},
	setConfig : function(config){
		this.config = config;
		return this;
	},
	add : function(property,condition,errorMessage,process){
		var me = this;

		me.fields.push({
			property : property,
			condition : condition,
			process : process,
			errorMessage : errorMessage
		});

		return me;
	},
	evaluate : function(){
		var me = this;

		return forEach(me.fields,function(_,field){
			var type = typeOf(field.condition),
				value = getNs(field.property,me.config);

			if (type === 'function') {
				if (field.condition(value,me.config) === false) {
					throw new TypeError(field.errorMessage);
				}
			} else if (value !== field.condition) {
				throw new TypeError(field.errorMessage);
			}

			if (value && field.process) {
				field.process(value,me.config);
			}
		},true);
	}
});

module.exports = Klass.get('generic.Validator');