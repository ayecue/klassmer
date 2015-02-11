/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var Stack = require('./batch/stack'),
    forEach = require('../../../common/forEach'),
    from = require('../../../common/from'),
    Selector = require('./batch/selector');

function Batch(selectors){
	var me = this;

    me.selectors = Selector.factory(from(selectors));
    me.stack = new Stack();
}

Batch.prototype = {
	self : Batch,
    getStack : function(){
        return this.stack;
    },
    getSelectors : function(){
        return this.selectors;
    },
	evaluate : function(node,property){
        var me = this;

        forEach(me.selectors,function(_,selector){
            if (node.TYPE === selector.getType() && !selector.isComplete() && selector.evaluate(node)) {
                selector.add(node);
            }
        });
    },
    get : function(idx){
        return this.selectors[idx];
    },
    any : function(type){
        var me = this;

        return forEach(me.selectors,function(index,selector){
            if (type === selector.getType()) {
                this.result.push(selector);
            }
        },[]);
    },
    first : function(type){
        return this.any(type).shift();
    },
    last : function(type){
        return this.any(type).pop();
    }
};

module.exports = Batch;