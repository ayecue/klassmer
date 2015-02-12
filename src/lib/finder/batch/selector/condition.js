/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var forEach = require('../../../common/forEach'),
    Klass = require('../../../klass');

Klass.define('finder.batch.selector.Condition',{
    statics : {
        factory : function(conditions){
            return forEach(conditions,function(namespace,value){
                var klass = Klass.get('finder.batch.selector.Condition');
                this.result.push(new klass(namespace,value));
            },[]);
        }
    },
    constructor : function(namespace,value){
        this.extend({
            namespace : namespace,
            value : value
        });
    }
});

module.exports = Klass.get('finder.batch.selector.Condition');