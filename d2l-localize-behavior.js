import '@polymer/polymer/polymer-legacy.js';
import {
	addListener, formatDateTime, formatDate, formatFileSize, formatNumber,
	formatTime, getDocumentLanguageFallback, getDocumentLanguage, getTimezone,
	localize, parseDate, parseNumber, parseTime, removeListener
} from '@brightspace-ui/core/helpers/localization.js';

window.D2L = window.D2L || {};
window.D2L.PolymerBehaviors = window.D2L.PolymerBehaviors || {};

/** @polymerBehavior */
D2L.PolymerBehaviors.LocalizeBehavior = {
	properties: {
		formatDateTime: {
			type: Function,
			computed: '_computeFormatDateTime(language)'
		},
		formatDate: {
			type: Function,
			computed: '_computeFormatDate(language)'
		},
		formatFileSize: {
			type: Function,
			computed: '_computeFormatFileSize(language)'
		},
		formatNumber: {
			type: Function,
			computed: '_computeFormatNumber(language)'
		},
		formatTime: {
			type: Function,
			computed: '_computeFormatTime(language)'
		},
		language: {
			type: String,
			computed: '_computeLanguage(resources, __documentLanguage, __documentLanguageFallback)'
		},
		localize: {
			type: Function,
			computed: '_computeLocalize(language, resources)'
		},
		parseDate: {
			type: Function,
			computed: '_computeParseDate(language)'
		},
		parseNumber: {
			type: Function,
			computed: '_computeParseNumber(language)'
		},
		parseTime: {
			type: Function,
			computed: '_computeParseTime(language)'
		},
		resources: {type: Object},
		__documentLanguage: {
			type: String,
			value: function() {
				return getDocumentLanguage();
			}
		},
		__documentLanguageFallback: {
			type: String,
			value: function() {
				return getDocumentLanguageFallback();
			}
		},
		__languageChangeCallback: {
			type: Object
		}
	},
	observers: [
		'_languageChange(language)'
	],
	attached: function() {
		this.__languageChangeCallback = (documentLanguage, documentLanguageFallback) => {
			this.__documentLanguage = documentLanguage;
			this.__documentLanguageFallback = documentLanguageFallback;
		};
		addListener(this.__languageChangeCallback);
	},
	detached: function() {
		removeListener(this.__languageChangeCallback);
	},
	getTimezone: function() {
		return getTimezone();
	},
	_computeFormatDateTime: function(language) {
		return function(val, opts) {
			return formatDateTime(language, val, opts);
		};
	},
	_computeFormatDate: function(language) {
		return function(val, opts) {
			return formatDate(language, val, opts);
		};
	},
	_computeFormatFileSize: function(language) {
		return function(val) {
			return formatFileSize(language, val);
		};
	},
	_computeFormatNumber: function(language) {
		return function(val, opts) {
			return formatNumber(language, val, opts);
		};
	},
	_computeFormatTime: function(language) {
		return function(val, opts) {
			return formatTime(language, val, opts);
		};
	},
	_computeParseDate: function(language) {
		return function(val) {
			return parseDate(language, val);
		};
	},
	_computeParseNumber: function(language) {
		return function(val, opts) {
			return parseNumber(language, val, opts);
		};
	},
	_computeParseTime: function(language) {
		return function(val) {
			return parseTime(language, val);
		};
	},
	_computeLocalize: function(language, resources) {
		return function(key) {
			const args = {};
			for (let i = 1; i < arguments.length; i += 2) {
				args[arguments[i]] = arguments[i + 1];
			}
			return localize(key, resources[language], language, args);
		};
	},
	_computeLanguage: function(resources, lang, fallback) {
		var language = this._tryResolve(resources, lang)
			|| this._tryResolve(resources, fallback)
			|| this._tryResolve(resources, 'en-us');
		return language;
	},
	_languageChange: function() {
		this.fire('d2l-localize-behavior-language-changed');
	},
	_tryResolve: function(resources, val) {

		if (val === undefined || val === null) return null;
		val = val.toLowerCase();
		var baseLang = val.split('-')[0];

		var foundBaseLang = null;
		for (var key in resources) {
			var keyLower = key.toLowerCase();
			if (keyLower.toLowerCase() === val) {
				return key;
			} else if (keyLower === baseLang) {
				foundBaseLang = key;
			}
		}

		if (foundBaseLang) {
			return foundBaseLang;
		}

		return null;

	}
};
