/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var Klass = require('node-klass'),
    forEach = Klass.forEach,
    getNs = Klass.getNamespace,
    CONSTANTS = require('../../constants');

module.exports = Klass.define('Klassmer.Finder.Batch.Selector',{
    requires: [
        'Klassmer.Finder.Batch.Selector.Condition'
    ],
    found : [],
    statics : {
        factory : function(selectors){
            return forEach(selectors,function(_,config){
                var klass = Klass.get('Klassmer.Finder.Batch.Selector');
                this.result.push(new klass(config));
            },[]);
        }
    },
    constructor : function(config){
        this.extend({
            conditions : Klassmer.Finder.Batch.Selector.Condition.factory(config.conditions),
            type : config.type,
            resultType : config.resultType
        });
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
            var value = getNs(condition.getNamespace(),node);

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
});