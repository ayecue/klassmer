/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var Klass = require('node-klass'),
	uglifyjs = require('uglify-js'),
	from = Klass.from,
	forEach = Klass.forEach,
	CONSTANTS = require('./constants');

module.exports = Klass.define('Klassmer.Finder',{
	singleton : true,
	requires: [
		'Klassmer.Finder.Batch',
		'Klassmer.Finder.Processor'
	],
	constructor : function(){
		var $class = this.getKlass(),
			opts = $class.opts = {};

		opts[CONSTANTS.AST_TYPES.FUNCTION] = new Klassmer.Finder.Processor('multi',['body']).get();
		opts[CONSTANTS.AST_TYPES.VAR] =  new Klassmer.Finder.Processor('multi',['definitions']).get();
		opts[CONSTANTS.AST_TYPES.VAR_DEF] =  new Klassmer.Finder.Processor('single',['value']).get();
		opts[CONSTANTS.AST_TYPES.ASSIGN] =  new Klassmer.Finder.Processor('single',['right']).get();
		opts[CONSTANTS.AST_TYPES.CALL] =  new Klassmer.Finder.Processor('advanced',['expression',['args','expression']]).get();
		opts[CONSTANTS.AST_TYPES.SIMPLE_STATEMENT] =  new Klassmer.Finder.Processor('single',['body']).get();
		opts[CONSTANTS.AST_TYPES.TOPLEVEL] =  new Klassmer.Finder.Processor('multi',['body']).get();
		opts[CONSTANTS.AST_TYPES.OBJECT] =  new Klassmer.Finder.Processor('multi',['properties']).get();
		opts[CONSTANTS.AST_TYPES.OBJECT_KEY_VAL] =  new Klassmer.Finder.Processor('single',['value']).get();
		opts[CONSTANTS.AST_TYPES.IF] =  new Klassmer.Finder.Processor('single',['body']).get();
		opts[CONSTANTS.AST_TYPES.BLOCK_STATEMENT] =  new Klassmer.Finder.Processor('multi',['body']).get();
		opts[CONSTANTS.AST_TYPES.RETURN] =  new Klassmer.Finder.Processor('single',['value']).get();
	},
	findQueue : function(node,batch){
		var me = this,
			$class = me.getKlass();

        if (node instanceof uglifyjs.AST_Node) {
            if (node.TYPE in $class.opts) {
				var idx = batch.getStack().add(node);
                $class.opts[node.TYPE].apply(me,arguments);
                batch.getStack().remove(idx);
            }
        }
	},
	find : function(node,selectors){
		var me = this,
			batch = new Klassmer.Finder.Batch(selectors);

		me.findQueue(node,batch);

		return batch;
	}
});