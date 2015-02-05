/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var forEach = require('./forEach');

function Condition(namespace,value){
	var me = this;

    me.namespace = namespace;
    me.value = value;
}

Condition.factory = function(conditions){
    return forEach(conditions,function(namespace,value){
        this.result.push(new Condition(namespace,value));
    },[]);
};

Condition.prototype = {
	self : Condition,
    getNamespace : function(){
        return this.namespace;
    },
    getValue : function(){
        return this.value;
    }
};

module.exports = Condition;