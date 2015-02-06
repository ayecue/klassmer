/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var fs = require('fs'),
	printf = require('./printf'),
	uglifyjs = require('uglify-js'),
	CONSTANTS = require('./constants');

function Parser(module,start,end,separator,optimizer){
	var me = this;

	me.module = module;
	me.start = start;
	me.end = end;
	me.separator = separator;
	me.optimizer = optimizer;
}

Parser.prototype = {
	self : Parser,
	getSeperator : function(){
		return this.separator;
	},
	getOptimizer : function(){
		return this.optimizer;
	},
	getStart : function(){
		return this.start;
	},
	getEnd : function(){
		return this.end;
	},
	wrap : function(idx,code){
		var me = this;

		return me.process(me.module, {
			idx : idx,
			code : code
		});
	},
	process : function(code,data){
		return printf(code,data);
	},
	parse : function(idx,file){
		var me = this,
			code = fs.readFileSync(file,{
                encoding : CONSTANTS.READ.ENCODING,
                flag : CONSTANTS.READ.FLAG
            }),
			wrapped = me.wrap(idx,code);

		return uglifyjs.parse(wrapped);
	},
	toString : function(node,optimizer){
		var me = this,
			stream = uglifyjs.OutputStream(me.optimizer || optimizer);

		node.print(stream);

		return stream.toString();
	}
};

module.exports = Parser;