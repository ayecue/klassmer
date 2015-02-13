/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var path = require('path'),
	printf = require('../../common/printf'),
	Listener = require('../../generic/listener'),
	Event = require('../../traits/event'),
	extend = require('../../common/extend'),
	forEach = require('../../common/forEach'),
	manipulator = require('./packages/package/manipulator'),
	Package = require('./packages/package'),
	Parser = require('./packages/parser'),
	$Map = require('./packages/map'),
	Compiler = require('./packages/compiler'),
	Generator = require('../../generic/generator'),
	Tree = require('../../layout/tree'),
	Node = require('../../layout/node'),
	Klass = require('../../klass'),
	CONSTANTS = require('../../constants');

Klass.define('manager.commonjs.Packages',{
	traits : [
		'traits.Event'
	],
	constructor : function(config){
		this
			.extend({
				config : config,
				parser : new Parser(config),
				generator : new Generator(CONSTANTS.GENERATOR.MODULE),
				listener : new Listener(),
				map : new $Map(),
				compiler : new Compiler(config.getCompiler())
			})
			.extend({
				main : this.try(config.getSource(),config.getNamespace())
			});
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
	find : function(){
		var me = this;

		me.main.find();
		me.listener.fire('find',me,[me.main,me.map]);
		return me;
	},
	load : function(){
		var me = this;

		me.main.load();
		me.listener.fire('load',me,[me.main,me.map]);
		return me;
	},
	sort : function(){
		var me = this,
			sorted = me.map.sort();

		me.listener.fire('sort',me,[me.main,sorted]);
        return sorted;
    },
    getDependencyMap : function(){
    	var me = this,
    		main = new Tree('main');

    	me.find();
		me.load();

    	return forEach(me.map.all(),function(_,module){
    		var modulePath = module.getModulePath(),
    			node = new Node(modulePath,path.basename(modulePath),module.getDependencies().each(function(dep){
					this.result.push(dep.modulePath);
				},[]),{
	    			Package : module.getPackage().get('name'),
	    			Filename : path.basename(modulePath),
	    			Source : modulePath
				});

    		this.result.add(node);
    	},main);
    },
	toString : function(){
		var me = this,
			seperator = me.parser.getOptimizer().beautify ? me.parser.getSeparator() : '';

		me.find();
		me.load();

		var sorted = me.sort();

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
});

module.exports = Klass.get('manager.commonjs.Packages');