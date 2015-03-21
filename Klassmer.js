/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var colors = require('colors'),
    Klass = require('node-klass');

module.exports = Klass.setConfig({
    source: __filename
}).define('Klassmer',{
    singleton: true,
    requires: [
        'Klassmer.Merger',
        'Klassmer.Info'
    ],
    merge : function(options){
        try {
            var merger = new Klassmer.Merger(options.type,{
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
            var info = new Klassmer.Info(options.type,{
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
});