/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var forEach = require('../../common/forEach'),
	typeOf = require('../../common/typeOf'),
	namespace = require('../../common/namespace');

function Validator(config){
    var me = this;

    me.config = config;
    me.fields = [];
}

Validator.prototype = {
	self : Validator,
	setConfig : function(config){
		this.config = config;
		return this;
	},
	getConfig : function(){
		return this.config;
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
				value = namespace(field.property,me.config);

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
};

module.exports = Validator;