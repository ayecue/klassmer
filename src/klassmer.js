/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var colors = require('colors'),
    CONSTANTS = require('./lib/constants');

module.exports = {
    forEach : require('./lib/common/forEach'),
    typeOf : require('./lib/common/typeOf'),
    toArray : require('./lib/common/toArray'),
    from : require('./lib/common/from'),
    indexOf : require('./lib/common/indexOf'),
    extend : require('./lib/common/extend'),
    printf : require('./lib/common/printf'),
    getNamespace : require('./lib/common/getNs'),
    setNamespace : require('./lib/common/regNs'),
    Listener : require('./lib/generic/listener'),
    Merger : require('./lib/merger'),
    Info : require('./lib/info'),
    Klass : require('./lib/klass'),
    merge : function(options){
        try {
            var merger = new this.Merger(options.type,{
                    separator: options.separator,
                    namespace: options.namespace,
                    wrapper: {
                        module: options.module,
                        start: options.start,
                        end: options.end
                    },
                    wrap: {
                        moduleFile: options.moduleFile,
                        startFile: options.startFile,
                        endFile: options.endFile
                    },
                    excludes: options.excludes,
                    source: options.source,
                    output: options.output,
                    compiler : options.compiler,
                    optimizer: options.optimizer
                });

            merger.on('load',function(main,map){
                console.info(("Merging " + map.all().length + " files...").grey.italic);
            });

            merger.write();

            console.info("Merging complete...OK".green.bold);
        } catch (e) {
            console.info(e.message.red.italic);
            console.info("Merging failed...FAIL".red.bold);
        }
    },
    info : function(options){
       try {
            var info = new this.Info(options.type,{
                    excludes: options.excludes,
                    source: options.source,
                    output: options.output,
                    compiler : options.compiler
                });

            console.info(("File " + info.print() + " created...").grey.italic);
            console.info("Information output complete...OK".green.bold);
        } catch (e) {
            console.info(e.message.red.italic);
            console.info("Information output failed...FAIL".red.bold);
        }
    }
};