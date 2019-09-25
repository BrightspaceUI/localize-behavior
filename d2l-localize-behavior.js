import '@polymer/polymer/polymer-legacy.js';
import { AppLocalizeBehavior } from '@polymer/app-localize-behavior/app-localize-behavior.js';
import {
	addListener, formatDateTime, formatDate, formatFileSize, formatNumber,
	formatTime, getDocumentLanguageFallback, getDocumentLanguage, getTimezone,
	parseDate, parseNumber, parseTime, removeListener
} from '@brightspace-ui/core/helpers/localization.js';

window.D2L = window.D2L || {};
window.D2L.PolymerBehaviors = window.D2L.PolymerBehaviors || {};

/** @polymerBehavior D2L.PolymerBehaviors.LocalizeBehaviorImpl */
D2L.PolymerBehaviors.LocalizeBehaviorImpl = {
	properties: {
		formatDateTime: {
			type: Function,
			computed: '_computeFormatDateTime(language, __resolveFast)'
		},
		formatDate: {
			type: Function,
			computed: '_computeFormatDate(language, __resolveFast)'
		},
		formatFileSize: {
			type: Function,
			computed: '_computeFormatFileSize(language, __resolveFast)'
		},
		formatNumber: {
			type: Function,
			computed: '_computeFormatNumber(language, __resolveFast)'
		},
		formatTime: {
			type: Function,
			computed: '_computeFormatTime(language, __resolveFast)'
		},
		language: {
			type: String,
			computed: '_computeLanguage(resources, __documentLanguage, __documentLanguageFallback)'
		},
		parseDate: {
			type: Function,
			computed: '_computeParseDate(language, __resolveFast)'
		},
		parseNumber: {
			type: Function,
			computed: '_computeParseNumber(language, __resolveFast)'
		},
		parseTime: {
			type: Function,
			computed: '_computeParseTime(language, __resolveFast)'
		},
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
		},
		/*
		 * Required so that the format/parse computed functions resolve
		 * immediately and become defined. Otherwise they won't be defined if
		 * another component's computed property that calls them.
		 */
		__resolveFast: {
			type: Boolean,
			value: true
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

/** @polymerBehavior */
D2L.PolymerBehaviors.LocalizeBehavior = [
	AppLocalizeBehavior,
	D2L.PolymerBehaviors.LocalizeBehaviorImpl
];
