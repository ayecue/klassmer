/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var Klass = require('../klass'),
	indexOf = require('../common/indexOf');

Klass.define('generic.Listener',{
	pool : {},
	/**
	 *	Register event
	 */
	on : function(name,fn,scope){
		var self = this;
		self.pool[name] = self.pool[name] || [];
		self.pool[name].push({
			callback : fn,
			scope : scope
		});
		return self;
	},
	/**
	 *	Trigger event
	 */
	fire : function(name,ctx,args){
		var self = this;
		if (name in self.pool) {
			for (var index = 0, length = self.pool[name].length; index < length;) {
				var current = self.pool[name][index++];
				current.callback.apply(current.scope || ctx,args);
			}
		}
		return self;
	},
	/**
	 *	Unregister event
	 */
	off : function(name,fn){
		var self = this;
		if (name in self.pool){
			var index = indexOf(self.pool[name],function(_){
				return fn == _.callback;
			});
			if (index !== -1) {
				self.pool[name].splice(index,1);
			}
		}
		return self;
	}
});

module.exports = Klass.get('generic.Listener');