/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var Klass = require('node-klass'),
	toArray = Klass.toArray,
	forEach = Klass.forEach,
	from = Klass.from,
	CONSTANTS = require('../constants');

module.exports = Klass.define('Klassmer.Finder.Processor',{
	statics : {
		opts : {
			single : function(properties,node,batch){
				var me = this;

				forEach(from(properties),function(_,property){
					if (node[property]) {
						batch.evaluate(node,property);
			            me.findQueue(node[property],batch);
			        }
				});
			},
			multi : function(properties,node,batch){
				var me = this;

				forEach(from(properties),function(_,property){
					if (node[property]) {
						var values = from(node[property]);

						batch.evaluate(node,property);
						forEach(values,function(_,v){
							me.findQueue(v,batch);
						});
					}
				});
			},
			advanced : function(checkProperties,loopProperties,node,batch){
				var me = this;

				forEach(from(checkProperties),function(_,property){
					if (node[property]) {
						batch.evaluate(node,property);
					}
				});

				forEach(from(loopProperties),function(_,property){
					if (node[property]) {
						var values = from(node[property]);

						forEach(values,function(_,v){
							me.findQueue(v,batch);
						});
					}
				});
			}
		}
	},
	constructor : function(type,args){
		this.extend({
			fn : null,
			type : type,
			args : args
		});
	},
	create : function(){
		var me = this,
			$class = me.getKlass();

		me.fn = function(){
			var args = toArray(arguments);

			return $class.opts[me.type].apply(this,me.args.concat(args));
		};

		return me;
	},
	get : function(){
		var me = this;

		return !me.fn ? me.create().get() : me.fn;
	} 
});