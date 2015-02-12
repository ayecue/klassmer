/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var path = require('path'),
	fs = require('fs'),
	printf = require('./common/printf'),
	writeFile = require('./common/writeFile'),
	forEach = require('./common/forEach'),
	Tree = require('./layout/tree'),
	Node = require('./layout/node'),
	Klass = require('./klass'),
	CONSTANTS = require('./constants');

Klass.define('Layout',{
	singleton : true,
	statics : {
		templatePath : path.resolve(__dirname,'./layout/template/visual.html'),
		codePath : path.resolve(__dirname,'./layout/template/code.js'),
		stylePath : path.resolve(__dirname,'./layout/template/style.css')
	},
	draw : function(output,map){
		var me = this,
			dir = path.dirname(output),
			json = map.toJSON(),
			template = fs.readFileSync(me.getClass().templatePath,{
                encoding : CONSTANTS.READ.ENCODING,
                flag : CONSTANTS.READ.FLAG
            }),
            code = fs.readFileSync(me.getClass().codePath,{
                encoding : CONSTANTS.READ.ENCODING,
                flag : CONSTANTS.READ.FLAG
            }),
            style = fs.readFileSync(me.getClass().stylePath,{
                encoding : CONSTANTS.READ.ENCODING,
                flag : CONSTANTS.READ.FLAG
            });

        var test = printf(template,{
        	title : 'none',
        	style : style,
        	map : json,
        	code : code
        });

		writeFile(path.join(dir,'visual.html'),test);
	}
});

module.exports = Klass.get('Layout');