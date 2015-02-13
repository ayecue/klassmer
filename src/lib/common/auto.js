/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var forEach = require('./forEach'),
	printf = require('./printf');

/**
 *	Shortcuts
 */
var setterNameTpl = 'set<%=:olettersnumber,camelcase:keyword%>',
	getterNameTpl = 'get<%=:olettersnumber,camelcase:keyword%>';

/**
 *	Create automatic setter/getter for class
 */
module.exports = function(values){
	var self = this;

	forEach(values,function(keyword,value){
		if (typeof value != 'function') {
			var setterName = printf(setterNameTpl,'keyword',keyword),
				getterName = printf(getterNameTpl,'keyword',keyword);

			if (!(setterName in self)) {
				self[setterName] = function(v){
					this[keyword]=v;
					return this;
				};
			}

			if (!(getterName in self)) {
				self[getterName] = function(){
					return this[keyword];
				};
			}
		}
	});
}