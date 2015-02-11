/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var toArray = require('../../../common/toArray'),
	forEach = require('../../../common/forEach'),
	from = require('../../../common/from'),
	CONSTANTS = require('../../../constants');

function Processor(type,args){
	var me = this;

	me.type = type;
	me.args = args;
	me.fn = null;
}

Processor.opts = {
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
};

Processor.prototype = {
	self : Processor,
	create : function(){
		var me = this;

		me.fn = function(){
			var args = toArray(arguments);

			return me.self.opts[me.type].apply(this,me.args.concat(args));
		};

		return me;
	},
	get : function(){
		var me = this;

		return !me.fn ? me.create().get() : me.fn;
	} 
};

module.exports = Processor;