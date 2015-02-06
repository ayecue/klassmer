/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var uglifyjs = require('uglify-js'),
	Batch = require('./batch'),
	from = require('./from'),
	forEach = require('./forEach'),
	Processor = require('./processor'),
	CONSTANTS = require('./constants');

function Finder(){
}

Finder.opts = {};
Finder.opts[CONSTANTS.TYPES.FUNCTION] = new Processor('multi',['body']).get();
Finder.opts[CONSTANTS.TYPES.VAR] =  new Processor('multi',['definitions']).get();
Finder.opts[CONSTANTS.TYPES.VAR_DEF] =  new Processor('single',['value']).get();
Finder.opts[CONSTANTS.TYPES.ASSIGN] =  new Processor('single',['right']).get();
Finder.opts[CONSTANTS.TYPES.CALL] =  new Processor('single',['expression']).get();
Finder.opts[CONSTANTS.TYPES.SIMPLE_STATEMENT] =  new Processor('single',['body']).get();
Finder.opts[CONSTANTS.TYPES.TOPLEVEL] =  new Processor('multi',['body']).get();
Finder.opts[CONSTANTS.TYPES.OBJECT] =  new Processor('multi',['properties']).get();
Finder.opts[CONSTANTS.TYPES.OBJECT_KEY_VAL] =  new Processor('single',['value']).get();
Finder.opts[CONSTANTS.TYPES.IF] =  new Processor('single',['body']).get();
Finder.opts[CONSTANTS.TYPES.BLOCK_STATEMENT] =  new Processor('multi',['body']).get();

Finder.prototype = {
	self : Finder,
	findQueue : function(node,batch){
		var me = this;

        if (node instanceof uglifyjs.AST_Node) {
            if (node.TYPE in me.self.opts) {
				var idx = batch.getStack().add(node);
                me.self.opts[node.TYPE].apply(me,arguments);
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
};

module.exports = new Finder();