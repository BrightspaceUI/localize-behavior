import '@polymer/polymer/polymer-legacy.js';
import { AppLocalizeBehavior } from './app-localize-behavior.js';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';
import { formatDateTime, formatDate, formatTime, parseDate, parseTime } from '@brightspace-ui/intl/lib/dateTime.js';
import { formatNumber, parseNumber } from '@brightspace-ui/intl/lib/number.js';
import { formatFileSize } from '@brightspace-ui/intl/lib/fileSize.js';

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
				return getDocumentLocaleSettings().language;
			}
		},
		__documentLanguageFallback: {
			type: String,
			value: function() {
				return getDocumentLocaleSettings().fallbackLanguage;
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
		const documentLocaleSettings = getDocumentLocaleSettings();
		this.__languageChangeCallback = () => {
			this.__documentLanguage = documentLocaleSettings.language;
			this.__documentLanguageFallback = documentLocaleSettings.fallbackLanguage;
		};
		documentLocaleSettings.addChangeListener(this.__languageChangeCallback);
		this.__languageChangeCallback();
	},
	detached: function() {
		getDocumentLocaleSettings().removeChangeListener(this.__languageChangeCallback);
	},
	getTimezone: function() {
		return getDocumentLocaleSettings().timezone;
	},
	_computeFormatDateTime: function() {
		return function(val, opts) {
			return formatDateTime(val, opts);
		};
	},
	_computeFormatDate: function() {
		return function(val, opts) {
			return formatDate(val, opts);
		};
	},
	_computeFormatFileSize: function() {
		return function(val) {
			return formatFileSize(val);
		};
	},
	_computeFormatNumber: function() {
		return function(val, opts) {
			return formatNumber(val, opts);
		};
	},
	_computeFormatTime: function() {
		return function(val, opts) {
			return formatTime(val, opts);
		};
	},
	_computeParseDate: function() {
		return function(val) {
			return parseDate(val);
		};
	},
	_computeParseNumber: function() {
		return function(val, opts) {
			return parseNumber(val, opts);
		};
	},
	_computeParseTime: function() {
		return function(val) {
			return parseTime(val);
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
