/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var toArray = require('./toArray'),
	forEach = require('./forEach'),
	from = require('./from');

function Processor(type,args){
	var me = this;

	me.type = type;
	me.args = args;
	me.fn = null;
}

Processor.opts = {
	single : function(property,node,batch){
        if (node[property]) {
			batch.evaluate(node,property);
            this.findQueue(node[property],batch);
        }
	},
	multi : function(property,node,batch){
		var me = this,
			values = from(node[property]);

		batch.evaluate(node,property);
		forEach(values,function(_,v){
			me.findQueue(v,batch);
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