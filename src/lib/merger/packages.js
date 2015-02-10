/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var path = require('path'),
	printf = require('../common/printf'),
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
	me.main = me.try(config.getSource(),config.getNamespace());
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
    addToMap : function(module){
        this.map.add(module);
        return this;
    },
    findPackage : function(name){
    	return this.map.find(name);
    },
    findModule : function(modulePath){
    	return this.map.findModule(modulePath);
    },
	try : function(src,name){
		var me = this,
			basename = path.basename(src),
			options = {
				main : src,
				name : name
			};

		if (CONSTANTS.PACKAGES.FILE_NAME === basename) {
			options = Package.read(src);

			if (!options.main) {
				throw new TypeError(printf(CONSTANTS.ERRORS.PACKAGES_ADD,'src',src));
			}

			options.main = manipulator.extension(path.resolve(path.dirname(src),options.main));
			options.name = name || options.name;
		}

		return me.map.find(options.name) || me.create(options);
	},
	create : function(options){
		return new Package(this,options);
	},
	sort : function(){
        return this.map.sort();
    },
	toString : function(){
		var me = this,
			seperator = me.parser.getOptimizer().beautify ? me.parser.getSeparator() : '';

		me.main.find();
		me.listener.fire('find',me,[me.main,me.map]);

		me.main.load();
		me.listener.fire('load',me,[me.main,me.map]);

		var sorted = me.sort();
		me.listener.fire('sort',me,[me.main,sorted]);

		return [
            me.parser.process(me.parser.getStart(),{
                namespace : me.main.get('name')
            }),
            sorted.each(function(module){
	            this.result.push(module.compile());
	        },[]).join(seperator),
            me.parser.process(me.parser.getEnd(),{
                namespace : me.main.get('name')
            })
        ].join(seperator);
	}
};

module.exports = Packages;