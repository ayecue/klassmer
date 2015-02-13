/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var forEach = require('../common/forEach'),
	extend = require('../common/extend'),
	callParent = require('../common/parent'),
	logger = require('./logger'),
	stack = require('./stack'),
	Listener = require('./listener'),
	CONSTANTS = require('../constants');

/**
 *	Default class statics
 */
module.exports = function(name,handle){
	var statics = {
		/**
		 *	Default variables
		 */
		singleton : CONSTANTS.KLASS.SINGLETON,
		debug : CONSTANTS.KLASS.DEBUGGING,
		autoSetterGetter : CONSTANTS.KLASS.AUTO,
		listener : new Listener(),
		$classname : name,
		$mixins : {},
		/**
		 *	Default methods
		 */
		getClass : function(){
			return this;
		},
		getListener : function(){
			return this.listener;
		},
		getMixins : function(){
			return this.$mixins;
		},
		getCalledMethod : function(){
			return stack.g();
		},
		getCalledMethodKlass : function(){
			var calledMethod = this.getCalledMethod();
			return calledMethod && calledMethod.$klass;
		},
		getCalledMethodName : function(){
			var calledMethod = this.getCalledMethod();
			return calledMethod && calledMethod.$name;
		},
		getCalledMethodFunction : function(){
			var calledMethod = this.getCalledMethod();
			return calledMethod && calledMethod.$function;
		},
		getCalledMethodBefore : function(){
			var calledMethod = this.getCalledMethod();
			return calledMethod && calledMethod.$last;
		},
		callParent : function(args){
			callParent.call(this,args);
		},
		getParent : function(){
			return this.$parent;
		},
		getName : function(){
			return this.$classname;
		},
		logMessage : function(args,error){
			logger(this,args,error);
		},
		isDebug : function(){
			return this.debug;
		},
		applyTo : function(handle,force){
			var parent = this;

			if (parent) {
				forEach(parent,function(keyword,value){
					(!(keyword in handle) || force) && (handle[keyword] = value);
				});

				forEach(parent.prototype,function(keyword,value){
					(!(keyword in handle.prototype) || force) && (handle.prototype[keyword] = value);
				});

				handle.prototype.$defaultValues = extend({},parent.prototype.$defaultValues,handle.prototype.$defaultValues);
			}
		}
	};

	return statics;
};