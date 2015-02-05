/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var forEach = require('./forEach'),
    namespace = require('./namespace'),
    Condition = require('./condition'),
    CONSTANTS = require('./constants');

function Selector(config){
	var me = this;

    me.conditions = Condition.factory(config.conditions);
    me.type = config.type;
    me.resultType = config.resultType;
    me.found = [];
}

Selector.factory = function(selectors){
    return forEach(selectors,function(_,config){
        this.result.push(new Selector(config));
    },[]);
};

Selector.prototype = {
	self : Selector,
    getType : function(){
        return this.type;
    },
    getFound : function(){
        return this.found;
    },
    getResultType : function(){
        return this.resultType;
    },
    add : function(node){
        var me = this;

        if (!me.isComplete()) {
            me.found.push(node);
        }
    },
    evaluate : function(node){
        var me = this;

        return forEach(me.conditions,function(_,condition){
            var value = namespace(condition.getNamespace(),node);

            if (value !== condition.getValue()) {
                this.result = false;
                this.skip = true;
            }
        },true);
    },
    isComplete : function(){
        var me = this;

        return CONSTANTS.SELECTOR.SINGLE === me.resultType && me.found.length > 0;
    },
    isEmpty : function(){
        return this.found.length === 0;
    },
    each : function(fn){
        var me = this;

        forEach(me.found,function(index,node){
            fn.call(me,node,index);
        });
    }
};

module.exports = Selector;