/* jshint node: true */
/* global require, module */
var emberMergeConfig  = require('./index');
var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

var EmberApp = emberMergeConfig.getConstructorForEmberAppWithMergedConfig(EmberAddon.prototype.appConstructor);

EmberAddon.prototype = Object.create(EmberApp.prototype);
EmberAddon.prototype.constructor = EmberAddon;
EmberAddon.prototype.appConstructor = EmberApp.prototype.constructor;

var app = new EmberAddon({
	'ember-merge-config': {
		isBase64: true
	}
});

// Use `app.import` to add additional libraries to the generated
// output files.
//
// If you need to use different assets in different
// environments, specify an object as the first parameter. That
// object's keys should be the environment name and the values
// should be the asset to use in that environment.
//
// If the library that you are including contains AMD or ES6
// modules that you would like to import into your application
// please specify an object with the list of modules as keys
// along with the exports of each module as its value.

module.exports = app.toTree();
