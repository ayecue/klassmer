/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var JSON2 = require('JSON2'),
    indexOf = require('../common/indexOf'),
    forEach = require('../common/forEach'),
    Klass = require('../klass'),
    Generator = require('../generic/generator'),
    CONSTANTS = require('../constants');

Klass.define('layout.Tree',{
    statics : {
        generator : new Generator(CONSTANTS.GENERATOR.NODE)
    },
    collection : [],
    constructor : function(id){
        this.extend({
            id : id || CONSTANTS.LAYOUT.UNKNOWN
        });
    },
   	add : function(){
   		this.collection.push.apply(this.collection,arguments);
   		return this;
   	},
    toJSON : function(){
        var me = this,
            nodes = forEach(me.collection,function(_,node){
                this.result.push({
                    id : node.getId(),
                    internalId : me.getClass().generator.get(),
                    links : node.getLinks(),
                    data : node.getData()
                });
            },[]),
            links = forEach(nodes,function(index,node){
                forEach(node.links,function(_,link){
                    this.result.push({
                        source : index,
                        target : indexOf(nodes,function(n){
                            return n.id === link;
                        }),
                        internalId : node.internalId
                    });
                },this.result);
            },[]);

        return JSON2.stringify({
            nodes : nodes,
            links : links
        });
    }
})

module.exports = Klass.get('layout.Tree');