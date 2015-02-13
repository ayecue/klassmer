/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var Klass = require('../klass'),
	Base = require('./base'),
	Config = require('./commonjs/config'),
	Packages = require('./commonjs/packages'),
	CONSTANTS = require('../constants');

Klass.define('manager.CommonJs',{
	extends : 'manager.Base',
	statics : {
		type : 'commonjs'
	},
	constructor : function(options){
		var me = this,
			config = new Config(options).validate();

		me.callParent(arguments);
		me.extend({
			config : config,
			packages : new Packages(config)
		});

		me.initEvents();
	},
	initEvents : function(){
		var me = this;

		me.packages
            .on('find',function(){
                me.fire('find',me,arguments);
            })
            .on('load',function(){
                me.fire('load',me,arguments);
            })
            .on('sort',function(){
                me.fire('sort',me,arguments);
            });
	},
	getDependencyMap : function(){
		return this.packages.getDependencyMap();
	},
	toString : function(){
		return this.packages.toString();
	},
	getOutput : function(){
		return this.config.getOutput();
	}
});

module.exports = Klass.get('manager.CommonJs');