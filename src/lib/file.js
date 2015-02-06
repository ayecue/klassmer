/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

function File(path,ignore){
    var me = this;

    me.path = path;
    me.ignore = ignore || false;
}

File.prototype = {
    self : File,
    getPath : function(){
        return this.path;
    },
    validate : function(){
        var me = this;

        return !me.ignore && me.path && me.path.length !== 0;
    }
};

module.exports = File;