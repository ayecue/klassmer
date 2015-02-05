/*
 * klassmer
 * https://github.com/ayecue/klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var forEach = require('./forEach'),
	/**
	 *	Variables
	 */
	rxFirst = '%(?::([^:]+):)?',
	rxLast = '%',
	rxGlobal = 'gi',
	rxReplace = /%[^%]+%/ig,
	/**
	 *	Different Types
	 */
	formatTypes = {
		/**
		 *	Upper first letter
		 */
		camelcase : function(string){
			var pattern = /(^|\W)(\w)(\w*)/g,
				result = [],
				match;
			
			while (pattern.exec(string)) {
				result.push(RegExp.$1 + RegExp.$2.toUpperCase() + RegExp.$3);
			}
			
			return result.join('');
		},
		/**
		 *	Upper first letter, lower all other letters
		 */
		capitalise : function(string){
			var pattern = /(^|\W)(\w)(\w*)/g,
				result = [],
				match;
			
			while (pattern.exec(string)) {
				result.push(RegExp.$1 + RegExp.$2.toUpperCase() + RegExp.$3.toLowerCase());
			}
			
			return result.join('');
		},
		/**
		 *	Upper all
		 */
		upper : function(string){
			return string.toUpperCase();
		},
		/**
		 *	Lower all
		 */
		lower : function(string){
			return string.toLowerCase();
		},
		/**
		 *	Remove everything except upper letters
		 */
		ouletters : function(string){
			return string.replace(/[^A-Z]/g,'');
		},
		/**
		 *	Remove everything except lower letters
		 */
		olletters : function(string){
			return string.replace(/[^a-z]/g,'');
		},
		/**
		 *	Remove everything except numbers
		 */
		onumber : function(string){
			return string.replace(/[^0-9]/g,'');
		},
		/**
		 *	Remove everything except letters and numbers
		 */
		olettersnumber : function(string){
			return string.replace(/[^a-z0-9]/ig,'');
		},
		/**
		 *	Just allow normal chars
		 */
		oword : function(string){
			return string.replace(/\W/g,'');
		},
		/**
		 *	Remove all upper letters
		 */
		ruletters : function(string){
			return string.replace(/[A-Z]/g,'');
		},
		/**
		 *	Remove all lower letters
		 */
		rlletters : function(string){
			return string.replace(/[a-z]/g,'');
		},
		/**
		 *	Remove all numbers
		 */
		rnumber : function(string){
			return string.replace(/[0-9]/g,'');
		},
		/**
		 *	Remove all word chars
		 */
		rword : function(string){
			return string.replace(/\w/g,'');
		},
		/**
		 *	Remove all dots
		 */
		rdot : function(string){
			return string.replace(/\./g,'');
		},
		/**
		 *	Remove whitespaces left/right
		 */
		trim : function(string){
			return string.replace(/^\s+|\s+$/g,'');
		},
		/**
		 *	Remove whitespaces left
		 */
		triml : function(string){
			return string.replace(/^\s+/g,'');
		},
		/**
		 *	Remove whitespaces right
		 */
		trimr : function(string){
			return string.replace(/\s+$/g,'');
		}
	},
	/**
	 *	Functions
	 */
	format = function(string,doFormat){
		if (doFormat in formatTypes){
			return formatTypes[doFormat](string);
		}
		
		return false;
	},
	printf = function(string,object,value){
		if (typeof value === 'string') {
			return string.replace(new RegExp(rxFirst + object + rxLast, rxGlobal), function(toReplace,formatCmds){
				return formatCmds ? forEach(formatCmds.split(','),function(_,cmd){
					this.result = format(this.result,cmd);
				},value) : value;
			}).replace(rxReplace,'');
		} else if (typeof object === 'object') {
			return forEach(object,function(key,value){
				this.result = this.result.replace(new RegExp(rxFirst + key + rxLast, rxGlobal), function(toReplace,formatCmds){					
					return formatCmds ? forEach(formatCmds.split(','),function(_,cmd){
						this.result = format(this.result,cmd);
					},value) : value;
				});
			},string).replace(rxReplace,'');
		}
	
		return string;
	};

module.exports = printf;