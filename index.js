/* jshint node: true */
'use strict';

module.exports = {
	name: 'ember-merge-config',
	applyMergeConfig: function(EmberApp) {
		var originalFn = EmberApp.prototype._contentForConfigModule;
		EmberApp.prototype._contentForConfigModule = function(content, config) {
			var varName = (this.options && this.options['ember-merge-config'] && this.options['ember-merge-config'].globalVarName) || 'configToMerge';
			var isBase64 = !!(this.options && this.options['ember-merge-config'] && this.options['ember-merge-config'].isBase64);
			var injectedContent = [
					'\tvar parsedConfigToMerge;',
					'\tif (window["' + varName + '"]) {',
					'\t\ttry {',
					'\t\t\tparsedConfigToMerge = window["' + varName + '"]',
					isBase64 ? [
						'\t\t\tif (typeof window["' + varName + '"] === "string") {',
						'\t\t\t\tparsedConfigToMerge = JSON.parse(atob(window["' + varName + '"]);',
						'\t\t\t}',
					].join('\n') : '',
					'\t\t\tEmber[\'default\'].$.extend(true, config, parsedConfigToMerge);',
					'\t\t} catch (e) {}',
					'\t}'
				].join('\n') + '\n',
				returnIndex,
				appConfigFromMeta;

			originalFn.call(this, content, config);

			appConfigFromMeta = content[content.length - 1].toString();
			returnIndex = appConfigFromMeta.indexOf('return ');
			appConfigFromMeta = appConfigFromMeta.substring(0, returnIndex) + injectedContent + appConfigFromMeta.substring(returnIndex, appConfigFromMeta.length);
			content[content.length - 1] = appConfigFromMeta;
		};
		return EmberApp;
	}
};