/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var Klass = require('node-klass');

module.exports = Klass.define('Klassmer.Mixins.Event',{
	on : function(){
		return this.listener.on.apply(this.listener,arguments);
	},
	fire : function(){
		return this.listener.fire.apply(this.listener,arguments);
	},
	off : function(){
		return this.listener.off.apply(this.listener,arguments);
	}
});