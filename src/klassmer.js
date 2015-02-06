/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var writeFile = require('./lib/writeFile'),
    colors = require('colors');

module.exports = {
    forEach : require('./lib/forEach'),
    typeOf : require('./lib/typeOf'),
    toArray : require('./lib/toArray'),
    from : require('./lib/from'),
    Listener : require('./lib/listener'),
    indexOf : require('./lib/indexOf'),
    extend : require('./lib/extend'),
    printf : require('./lib/printf'),
    finder : require('./lib/finder'),
    Parser : require('./lib/parser'),
    Config : require('./lib/config'),
    Merger : require('./lib/merger'),
    run : function(options){
        var config = new this.Config({
            separator: options.separator || "\n\n",
            namespace: options.namespace || "result",
            wrapper: {
                module: options.module || "var <%= idx %> = (function(){ <%= code %> })();",
                start: options.start || "(function (global, factory) {global.<%= namespace %> = factory(global);}(this, function (global) {",
                end: options.end || "return <%= namespace %>;}));"
            },
            wrap: {
                moduleFile: options.moduleFile,
                startFile: options.startFile,
                endFile: options.endFile
            },
            excludes: options.excludes,
            pkg: options.package,
            src: options.source,
            out: options.output,
            optimizer: options.optimizer || {
                beautify : true,
                comments : true
            }
        });

        try {
            config.validate();

            var parser = new this.Parser(
                    config.wrapper.module,
                    config.wrapper.start,
                    config.wrapper.end,
                    config.separator,
                    config.optimizer
                ),
                merger = new this.Merger(config.pkg,parser,config.excludes);

            merger.getListener().on('load',function(main,map){
                console.info(("Merging " + map.size() + " files...").grey.italic);
            });

            writeFile(config.out,merger.run());

            console.info("Merging complete...OK".green.bold);
        } catch (e) {
            console.info(e.message.red.italic);
            console.info("Merging failed...FAIL".red.bold);
        }
    }
};