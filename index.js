/* jshint node: true */
'use strict';

module.exports = {
	name: 'ember-merge-config',
	getConstructorForEmberAppWithMergedConfig: function(EmberApp) {
		var sel;

		function EmberAppWithMergedConfig() {
			var args = Array.prototype.slice.call(arguments);
			return EmberApp.apply(this, args);
		}

		EmberAppWithMergedConfig.prototype = Object.create(EmberApp.prototype);
		EmberAppWithMergedConfig.constructor = EmberAppWithMergedConfig;

		if (typeof EmberApp.env === 'function') {
			EmberAppWithMergedConfig.env = EmberApp.env;	
		}

		if (EmberApp.prototype._contentForConfigModule) {
			EmberAppWithMergedConfig.prototype._contentForConfigModule = function(content, config) {
				var options = this.options && this.options['ember-merge-config'],
					injectedContent = getInjectedContent(options),
					returnIndex,
					appConfigFromMeta;

				EmberApp.prototype._contentForConfigModule.call(this, content, config);

				appConfigFromMeta = content[content.length - 1].toString();
				returnIndex = appConfigFromMeta.indexOf('return ');
				appConfigFromMeta = appConfigFromMeta.substring(0, returnIndex) + injectedContent + appConfigFromMeta.substring(returnIndex, appConfigFromMeta.length);
				content[content.length - 1] = appConfigFromMeta;
			};

		} else {
			
			EmberAppWithMergedConfig.prototype.contentFor = function(config, match, type) {
				var content, varName, isBase64, injectedContent, returnIndex, appConfigFromMeta,
					options = this.options && this.options['ember-merge-config'];

				if (type !== 'config-module') {

					return EmberApp.prototype.contentFor.call(this, config, match, type);

				} else {

					injectedContent = getInjectedContent(options);

					content = EmberApp.prototype.contentFor.call(this, config, match, type);
					returnIndex = content.indexOf('return ');
					content = content.substring(0, returnIndex) + injectedContent + content.substring(returnIndex, content.length);

					return content;
				}

			};
		}

		return EmberAppWithMergedConfig;
	}
};

function getInjectedContent(options) {
	options = options || {};
	
	var varName = options.globalVarName || 'configToMerge',
		isBase64 = !!(options && options.isBase64),
		injectedContent = [
			'var parsedConfigToMerge;',
			'\tif (window["' + varName + '"]) {',
			'\t\ttry {',
			'\t\t\tparsedConfigToMerge = window["' + varName + '"];',
			isBase64 ? [
				'\t\t\tif (typeof window["' + varName + '"] === "string") {',
				'\t\t\t\tparsedConfigToMerge = JSON.parse(atob(window["' + varName + '"]);',
				'\t\t\t}',
			].join('\n') : '',
			'\t\t\tEmber[\'default\'].$.extend(true, config, parsedConfigToMerge);',
			'\t\t} catch (e) {}',
			'\t}'
		].join('\n') + '\n\t';

	return injectedContent;
}