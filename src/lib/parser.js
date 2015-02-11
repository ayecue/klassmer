/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var fs = require('fs'),
	printf = require('./common/printf'),
	uglifyjs = require('uglify-js'),
	CONSTANTS = require('./constants');

function Parser(config){
	var me = this;

	me.wrapper = config.getWrapper();
	me.separator = config.getSeparator();
	me.optimizer = config.getOptimizer();
}

Parser.prototype = {
	self : Parser,
	setSeparator : function(separator){
		this.separator = separator;
		return this;
	},
	getSeparator : function(){
		return this.separator;
	},
	setOptimizer : function(optimizer){
		this.optimizer = optimizer;
		return this;
	},
	getOptimizer : function(){
		return this.optimizer;
	},
	setWrapper : function(wrapper){
		this.wrapper = wrapper;
		return this;
	},
	getStart : function(){
		return this.wrapper.start;
	},
	getEnd : function(){
		return this.wrapper.end;
	},
	wrap : function(idx,code){
		var me = this;

		return me.process(me.wrapper.module, {
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

		try {
			return uglifyjs.parse(wrapped);
		} catch (e) {
			throw new Error(printf(CONSTANTS.ERRORS.PARSER_PARSE,'file',file));
		}
	},
	toString : function(node){
		var me = this,
			stream = uglifyjs.OutputStream(me.optimizer);

		node.print(stream);

		return stream.toString();
	}
};

module.exports = Parser;