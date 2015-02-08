/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var path = require('path'),
	Listener = require('../generic/listener'),
	extend = require('../common/extend'),
	forEach = require('../common/forEach'),
	manipulator = require('./packages/package/manipulator'),
	Package = require('./packages/package'),
	Parser = require('./parser'),
	$Map = require('./packages/map'),
	Generator = require('../generic/generator'),
	CONSTANTS = require('../constants');

function Packages(config){
	var me = this;

	me.config = config;
	me.parser = new Parser(config);
	me.generator = new Generator(CONSTANTS.GENERATOR.MODULE);
	me.listener = new Listener();
	me.map = new $Map();
	me.main = me.add(config.getSource(),config.getNamespace());
}

Packages.prototype = {
	self : Packages,
	getMap : function(){
        return this.map;
    },
	getGenerator : function(){
		return this.generator;
	},
	getParser : function(){
		return this.parser;
	},
	getConfig : function(){
		return this.config;
	},
	getListener : function(){
        return this.listener;
    },
	add : function(src,name){
		var me = this,
			basename = path.basename(src),
			options = {
				main : src,
				name : name
			};

		if (CONSTANTS.PACKAGES.FILE_NAME === basename) {
			options = Package.read(src);
			options.main = manipulator.extension(path.resolve(path.dirname(src),options.main));
			options.name = name || options.name;
		}

		return new Package(me,options);
	},
	sort : function(){
		var me = this;
        me.map.set(me.map.sort());
        return me;
    },
	toString : function(){
		var me = this,
			seperator = me.parser.getOptimizer().beautify ? me.parser.getSeparator() : '';

		me.main.find();
		me.listener.fire('find',me,[me.main,me.map]);

		me.main.load();
		me.listener.fire('load',me,[me.main,me.map]);

		me.sort();
		me.listener.fire('sort',me,[me.main,me.map]);

		return [
            me.parser.process(me.parser.getStart(),{
                namespace : me.main.get('name')
            }),
            me.map.each(function(module){
	            this.result.push(module.compile());
	        },[]).join(seperator),
            me.parser.process(me.parser.getEnd(),{
                namespace : me.main.get('name')
            })
        ].join(seperator);
	}
};

module.exports = Packages;