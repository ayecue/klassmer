/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var forEach = require('../../../../common/forEach'),
    namespace = require('../../../../common/namespace'),
    Condition = require('./selector/condition'),
    CONSTANTS = require('../../../../constants');

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
    indexOf : function(node){
        var me = this;

        return forEach(me.found,function(_,n){
            if (n.id == node.id) {
                this.result = _;
                this.skip = true;
            }
        },-1);
    },
    add : function(){
        var me = this;

        forEach(arguments,function(_,node){
            if (!me.isComplete()) {
                me.found.push(node);
            }
        });
    },
    remove : function(){
        var me = this;

        forEach(arguments,function(_,node){
            var index = me.indexOf(node);

            if (index !== -1) {
                me.found.splice(index,1);
            }
        });
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