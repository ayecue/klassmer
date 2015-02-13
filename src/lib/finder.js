/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var uglifyjs = require('uglify-js'),
	Klass = require('./klass'),
	Batch = require('./finder/batch'),
	from = require('./common/from'),
	forEach = require('./common/forEach'),
	Processor = require('./finder/processor'),
	CONSTANTS = require('./constants');

Klass.define('Finder',{
	singleton : true,
	constructor : function(){
		var $class = this.getClass(),
			opts = $class.opts = {};

		opts[CONSTANTS.AST_TYPES.FUNCTION] = new Processor('multi',['body']).get();
		opts[CONSTANTS.AST_TYPES.VAR] =  new Processor('multi',['definitions']).get();
		opts[CONSTANTS.AST_TYPES.VAR_DEF] =  new Processor('single',['value']).get();
		opts[CONSTANTS.AST_TYPES.ASSIGN] =  new Processor('single',['right']).get();
		opts[CONSTANTS.AST_TYPES.CALL] =  new Processor('advanced',['expression',['args','expression']]).get();
		opts[CONSTANTS.AST_TYPES.SIMPLE_STATEMENT] =  new Processor('single',['body']).get();
		opts[CONSTANTS.AST_TYPES.TOPLEVEL] =  new Processor('multi',['body']).get();
		opts[CONSTANTS.AST_TYPES.OBJECT] =  new Processor('multi',['properties']).get();
		opts[CONSTANTS.AST_TYPES.OBJECT_KEY_VAL] =  new Processor('single',['value']).get();
		opts[CONSTANTS.AST_TYPES.IF] =  new Processor('single',['body']).get();
		opts[CONSTANTS.AST_TYPES.BLOCK_STATEMENT] =  new Processor('multi',['body']).get();
		opts[CONSTANTS.AST_TYPES.RETURN] =  new Processor('single',['value']).get();
	},
	findQueue : function(node,batch){
		var me = this,
			$class = me.getClass();

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
			batch = new Batch(selectors);

		me.findQueue(node,batch);

		return batch;
	}
});

module.exports = Klass.get('Finder');