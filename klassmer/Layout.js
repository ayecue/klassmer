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
	Klass = require('node-klass'),
	printf = Klass.printf,
	forEach = Klass.forEach,
	CONSTANTS = require('./constants');

module.exports = Klass.define('Klassmer.Layout',{
	singleton : true,
	requires: [
		'Klassmer.Layout.Tree',
		'Klassmer.Layout.Node',
		'Klassmer.Util'
	],
	statics : {
		templatePath : path.resolve(__dirname,'./layout/template/visual.html'),
		codePath : path.resolve(__dirname,'./layout/template/code.js'),
		stylePath : path.resolve(__dirname,'./layout/template/style.css')
	},
	draw : function(output,map){
		var me = this,
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
            }),
            target = path.extname(output) === '.html' ? output : output + '.html';

		Klassmer.Util.writeFile(target,printf(template,{
        	title : target,
        	style : style,
        	map : json,
        	code : code
        }));

        return target;
	}
});