/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var Klass = require('node-klass'),
    forEach = Klass.forEach;

module.exports = Klass.define('Klassmer.Generic.Map',{
    constructor: function(){
        this.extend({
            collection: []
        });
    },
    add : function(){
        var me = this;
        me.collection.push.apply(me.collection,arguments);
        return me;
    },
    all : function(){
        return [].concat(this.collection);
    },
    set : function(collection){
        var me = this;
        me.collection = collection;
        return me;
    },
    size : function(){
        return this.collection.length;
    },
    each : function(fn,ctx){
        var me = this;

        return forEach(me.collection,function(_,module){
            fn.call(this,module);
        },ctx);
    },
    clear : function(){
        this.collection = [];
    }
});