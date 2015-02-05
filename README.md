# klassmer v0.2.2 
[![Build Status](https://travis-ci.org/ayecue/klassmer.png?branch=master)](https://travis-ci.org/ayecue/klassmer)

> Optimize CommonJS projects for your browser.


## Getting Started
This plugin requires UglifyJS `~2.4.16`

Install this plugin with this command:

```shell
npm install klassmer
```


## Description

This package will merge your CommonJS project to one file to use it in frontend without any overhead.


## Example:

Example project: [require-klass](https://github.com/ayecue/require-klass)


## Arguments

#### -ns (--namespace)
Type: `String`
Name of the output variable of your main module.

#### -m (--module)
Type: `String`
Wrapper for every single module.

#### -stpl (--start)
Type: `String`
Start of wrapper for whole merged project.

#### -etpl (--end)
Type: `String`
End of wrapper for whole merged project.

#### -mf (--moduleFile)
Type: `String`
Path to file which should wrap for every single module.

#### -sf (--startFile)
Type: `String`
Path to file which should start wrapping the whole merged project.

#### -ef (--endFile)
Type: `String`
Path to file which should end wrapping the whole merged project.

#### -src (--source)
Type: `String`
Path to main project file. (All other files will get loaded automaticly)

#### -out (--output)
Type: `String`
Path to merged output file.

#### -sep (--separator)
Type: `String`
Seperator between all modules.


## Functions

#### klassmer.forEach
Arguments: `Object`, `Function`, `Mixed`
Return: `Mixed`

#### klassmer.typeOf
Arguments: `Object`
Return: `String`

#### klassmer.toArray
Arguments: `Object`
Return: `Array`

#### klassmer.from
Arguments: `Object`
Return: `Array`

#### klassmer.indexOf
Arguments: `Array`, `Function`
Return: `Integer`

#### klassmer.extend
Arguments: `Object`, `Object` [...]
Return: `Object`

#### klassmer.printf
Arguments: `String`, `Object`
Return: `String`

#### klassmer.run
Arguments: `Object`


## Classes

#### klassmer.Listener
#### klassmer.finder
#### klassmer.Parser
#### klassmer.Config
#### klassmer.Merger