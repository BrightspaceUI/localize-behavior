import '@polymer/polymer/polymer-legacy.js';
import { formatDate, formatDateTime, formatTime, parseDate, parseTime } from '@brightspace-ui/intl/lib/dateTime.js';
import { formatNumber, parseNumber } from '@brightspace-ui/intl/lib/number.js';
import { getDocumentLocaleSettings, supportedLangpacks } from '@brightspace-ui/intl/lib/common.js';
import { AppLocalizeBehavior } from './app-localize-behavior.js';
import { formatFileSize } from '@brightspace-ui/intl/lib/fileSize.js';
import { getLocalizeOverrideResources } from './getLocalizeResources.js';

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
			computed: '_computeLanguage(resources, __documentLanguage, __documentLanguageFallback, __resolvedLanguage)'
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
		__possibleLanguages: {
			type: String,
			computed: '__computePossibleLanguages(__documentLanguage, __documentLanguageFallback)'
		},
		/*
		 * Required so that the format/parse computed functions resolve
		 * immediately and become defined. Otherwise they won't be defined if
		 * another component's computed property that calls them.
		 */
		__resolveFast: {
			type: Boolean,
			value: true
		},
		__resolvedLanguage: { type: String }
	},
	observers: [
		'__importResources(__possibleLanguages)',
		'_languageChange(language)'
	],

	created: function() {
		this.__resourcesPromise = this.resources ? Promise.resolve() : new Promise(r => this.__resolveResources = r);
	},

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
	__computePossibleLanguages: function(language, fallbackLanguage) {
		const langs = [ language, fallbackLanguage ]
			.filter(e => e)
			.map(e => [ e.toLowerCase(), e.split('-')[0] ])
			.flat();

		return [ ...new Set([ ...langs, 'en-us', 'en' ]) ];
	},
	_computeLanguage: function(resources, lang, fallback, resolvedLang) {
		if (this.localizeConfig.importFunc) return resolvedLang;

		const language = this._tryResolve(resources, lang)
			|| this._tryResolve(resources, fallback)
			|| this._tryResolve(resources, 'en-us');
		return language;
	},
	__importResources: async function(langs) {
		const { importFunc, osloCollection } = this.localizeConfig;

		if (!langs || !importFunc) return;

		// in dev, don't request unsupported langpacks
		if (!importFunc.toString().includes('switch')) {
			langs = langs.filter(lang => supportedLangpacks.includes(lang));
		}

		for (const lang of langs) {

			if (this.resources?.[lang]) {
				this.__resolvedLanguage = lang;
				return;
			}

			let response = await Promise.resolve(importFunc(lang)).catch(() => {});

			if (response) {

				if (osloCollection) {
					response = { ...response, ...(await getLocalizeOverrideResources(osloCollection)) };
				}

				this.__onRequestResponse({ response }, lang, true);
				this.__resolvedLanguage = lang;
				setTimeout(this.__resolveResources);
				return;
			}
		}
	},
	_languageChange: async function() {
		this.fire('d2l-localize-behavior-language-changed');
	},
	_tryResolve: function(resources, val) {

		if (val === undefined || val === null) return null;
		val = val.toLowerCase();
		const baseLang = val.split('-')[0];

		let foundBaseLang = null;
		for (const key in resources) {
			const keyLower = key.toLowerCase();
			if (keyLower === val) {
				return key;
			} else if (keyLower === baseLang) {
				foundBaseLang = key;
			}
		}

		if (foundBaseLang) {
			return foundBaseLang;
		}

		return null;

	},

	getLoadingComplete() {
		return this.__resourcesPromise;
	},

	localizeConfig: {}
};

/** @polymerBehavior */
D2L.PolymerBehaviors.LocalizeBehavior = [
	AppLocalizeBehavior,
	D2L.PolymerBehaviors.LocalizeBehaviorImpl
];
