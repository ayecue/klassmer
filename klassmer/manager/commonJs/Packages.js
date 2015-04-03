/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var path = require('path'),
	Klass = require('node-klass'),
	printf = Klass.printf,
	extend = Klass.extend,
	forEach = Klass.forEach,
	CONSTANTS = require('../../constants');

module.exports = Klass.define('Klassmer.Manager.CommonJs.Packages',{
	requires: [
        'Klassmer.Manager',
        'Klassmer.Layout.Tree',
        'Klassmer.Layout.Node',
        'Klassmer.Generic.Listener',
        'Klassmer.Generic.Generator',
        'Klassmer.Util',
        'Klassmer.Manager.CommonJs.Packages.Compiler',
        'Klassmer.Manager.CommonJs.Packages.Map',
        'Klassmer.Manager.CommonJs.Packages.Parser',
        'Klassmer.Manager.CommonJs.Packages.Package',
        'Klassmer.Manager.CommonJs.Packages.Package.Manipulator'
    ],
	mixins : {
        ev: 'Klassmer.Mixins.Event'
    },
	constructor : function(config){
		this
			.extend({
				config : config,
				parser : new Klassmer.Manager.CommonJs.Packages.Parser(config),
				generator : new Klassmer.Generic.Generator(CONSTANTS.GENERATOR.MODULE),
				listener : new Klassmer.Generic.Listener(),
				map : new Klassmer.Manager.CommonJs.Packages.Map(),
				compiler : new Klassmer.Manager.CommonJs.Packages.Compiler(config.getCompiler())
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
			options = Klassmer.Manager.CommonJs.Packages.Package.read(src);

			if (!options.main) {
				throw new TypeError(printf(CONSTANTS.ERRORS.PACKAGES_ADD,'src',src));
			}

			options.main = Klassmer.Manager.CommonJs.Packages.Package.Manipulator.extension(path.resolve(path.dirname(src),options.main));
			options.name = name || options.name;
		}

		return me.map.find(options.name) || me.create(options);
	},
	create : function(options){
		return new Klassmer.Manager.CommonJs.Packages.Package(this,options);
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
    		main = new Klassmer.Layout.Tree('main');

    	me.find();
		me.load();

    	return forEach(me.map.all(),function(_,module){
    		var modulePath = module.getModulePath(),
    			node = new Klassmer.Layout.Node(modulePath,path.basename(modulePath),module.getDependencies().each(function(dep){
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