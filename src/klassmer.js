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
    Listener : require('./lib/generic/listener'),
    indexOf : require('./lib/common/indexOf'),
    extend : require('./lib/common/extend'),
    printf : require('./lib/common/printf'),
    Merger : require('./lib/merger'),
    run : function(options){
        try {
            var merger = new this.Merger({
                    separator: options.separator || CONSTANTS.DEFAULTS.SEPARATOR,
                    namespace: options.namespace || CONSTANTS.DEFAULTS.NAMESPACE,
                    wrapper: {
                        module: options.module || CONSTANTS.DEFAULTS.MODULE,
                        start: options.start || CONSTANTS.DEFAULTS.START,
                        end: options.end || CONSTANTS.DEFAULTS.END
                    },
                    wrap: {
                        moduleFile: options.moduleFile,
                        startFile: options.startFile,
                        endFile: options.endFile
                    },
                    excludes: options.excludes,
                    src: options.source,
                    out: options.output,
                    optimizer: options.optimizer || CONSTANTS.DEFAULTS.OPTIMIZER
                });

            merger.getListener().on('load',function(main,map){
                console.info(("Merging " + map.size() + " files...").grey.italic);
            });

            merger.write();

            console.info("Merging complete...OK".green.bold);
        } catch (e) {
            console.info(e.message.red.italic);
            console.info("Merging failed...FAIL".red.bold);
        }
    }
};