import '../demo/test-elem-dynamic.js';
import '../demo/test-elem-dynamic-legacy.js';
import '../d2l-localize-behavior.js';
import { expect, fixture, html, oneEvent } from '@brightspace-ui/testing';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';
import { stub } from 'sinon';

function fixtureWithResources(template, opts) {
	return fixture(template, { awaitLoadingComplete: true, ...opts });
}

['legacy', 'class'].forEach(type => {

	let basic, langSet, enCa;

	if (type === 'legacy') {
		basic = html`<d2l-test-localize-behavior-dynamic-legacy name="Mary"></d2l-test-localize-behavior-dynamic-legacy>`;
		langSet = html`<d2l-test-localize-behavior-dynamic-legacy name="Mary" language="fr"></d2l-test-localize-behavior-dynamic-legacy>`;
		enCa = html`<d2l-test-localize-behavior-dynamic-legacy name="Mary" language="en-ca"></d2l-test-localize-behavior-dynamic-legacy>`;
	} else {
		basic = html`<d2l-test-localize-behavior-dynamic name="Mary"></d2l-test-localize-behavior-dynamic>`;
		langSet = html`<d2l-test-localize-behavior-dynamic name="Mary" language="fr"></d2l-test-localize-behavior-dynamic>`;
		enCa = html`<d2l-test-localize-behavior-dynamic name="Mary" language="en-ca"></d2l-test-localize-behavior-dynamic>`;
	}

	describe(`d2l-localize-behavior - ${type}`, () => {
		let elem;
		const documentLocaleSettings = getDocumentLocaleSettings();

		afterEach(() => {
			documentLocaleSettings.reset();
		});

		describe('initial load - dynamic', () => {

			it('should use "fallback" if "lang" is missing', async() => {
				documentLocaleSettings.fallbackLanguage = 'es';
				elem = await fixtureWithResources(basic, { lang: '' });
				expect(elem.language).to.equal('es');
			});

			it('should use "lang" if "fallback" is missing', async() => {
				elem = await fixtureWithResources(basic, { lang: 'es' });
				expect(elem.language).to.equal('es');
			});

			it('should use "fallback" if "lang" is invalid', async() => {
				documentLocaleSettings.fallbackLanguage = 'fr';
				elem = await fixtureWithResources(basic, { lang: 'zz' });
				expect(elem.language).to.equal('fr');
			});

			it('should use "lang" if "fallback" is invalid', async() => {
				documentLocaleSettings.fallbackLanguage = 'zz';
				elem = await fixtureWithResources(basic, { lang: 'de' });
				expect(elem.language).to.equal('de');
			});

			it('should use "lang" over "fallback" if both are valid', async() => {
				documentLocaleSettings.fallbackLanguage = 'es';
				elem = await fixtureWithResources(basic, { lang: 'de' });
				expect(elem.language).to.equal('de');
			});

			it('should use default (en) if "lang" and "fallback" are invalid', async() => {
				documentLocaleSettings.fallbackLanguage = 'yy';
				elem = await fixtureWithResources(basic, { lang: 'zz' });
				expect(elem.language).to.equal('en');
			});

			it('should use default (en) if "lang" and "fallback" are missing', async() => {
				elem = await fixtureWithResources(basic, { lang: '' });
				expect(elem.language).to.equal('en');
			});

			it('should use regional if specified', async() => {
				elem = await fixtureWithResources(basic, { lang: 'en-gb' });
				expect(elem.language).to.equal('en-gb');
			});

			it('should resolve with case of entry in resources, not on HTML element', async() => {
				elem = await fixtureWithResources(basic, { lang: 'en-GB' });
				expect(elem.language).to.equal('en-gb');
			});

			it('should use base language if regional is missing', async() => {
				elem = await fixtureWithResources(basic, { lang: 'en-ca' });
				expect(elem.language).to.equal('en');
			});

			it('should match language in a case-insensitive way', async() => {
				elem = await fixtureWithResources(basic, { lang: 'zH-Cn' });
				expect(elem.language).to.equal('zh-cn');
			});

		});

		describe('lang set - dynamic', () => {

			it('should ignore "language" attribute and use default', async() => {
				elem = await fixtureWithResources(langSet);
				expect(elem.language).to.equal('en');
			});

			it('should ignore "language" attribute and use "lang"', async() => {
				elem = await fixtureWithResources(langSet, { lang: 'de' });
				expect(elem.language).to.equal('de');
			});

		});

		describe('mutations - dynamic', () => {

			it('should update language if "lang" changes', async() => {
				elem = await fixtureWithResources(basic);
				setTimeout(() => documentLocaleSettings.language = 'fr');

				await oneEvent(elem, 'd2l-localize-behavior-language-changed');
				expect(elem.language).to.equal('fr');
			});

			it('should update language if "lang" is not set and "fallback" changes', async() => {
				elem = await fixtureWithResources(basic, { lang: null });
				setTimeout(() => documentLocaleSettings.fallbackLanguage = 'de');

				await oneEvent(elem, 'd2l-localize-behavior-language-changed');
				expect(elem.language).to.equal('de');
			});

			it('should not update language if "lang" is set and "fallback" changes', async() => {
				const shouldNotBeCalled = () => { throw 'unexpected'; };
				elem = await fixtureWithResources(basic, { lang: 'fr' });
				elem.addEventListener('d2l-localize-behavior-language-changed', shouldNotBeCalled);
				documentLocaleSettings.fallbackLanguage = 'de';
				await new Promise(resolve => setTimeout(resolve, 1000));
				elem.removeEventListener('d2l-localize-behavior-language-changed', shouldNotBeCalled);
			});

			it('should use default (en) if "lang" is removed', async() => {
				elem = await fixtureWithResources(basic, { lang: 'es' });
				setTimeout(() => documentLocaleSettings.language = null);

				await oneEvent(elem, 'd2l-localize-behavior-language-changed');
				expect(elem.language).to.equal('en');
			});

			it('should use default (en) if "fallback" is removed', async() => {
				documentLocaleSettings.fallbackLanguage = 'es';
				elem = await fixture(basic, { lang: null });
				setTimeout(() => documentLocaleSettings.fallbackLanguage = null);
				expect(elem.language).to.equal('es');
				await oneEvent(elem, 'd2l-localize-behavior-language-changed');
				expect(elem.language).to.equal('en');
			});

		});

		describe('localize', () => {

			let errorSpy;
			beforeEach(async() => {
				elem = await fixtureWithResources(enCa);
				errorSpy = stub(console, 'error');
			});

			afterEach(() => {
				errorSpy.restore();
			});

			it('should localize text', () => {
				const val = elem.localize('hello', 'name', 'Bill');
				expect(val).to.equal('Hello Bill');
			});

			it('should localize text using data binding', () => {
				expect(elem.$$('.text').innerText).to.equal('Hello Mary');
			});

			it('should re-localize text when locale changes', async() => {
				setTimeout(() => documentLocaleSettings.language = 'fr');

				await oneEvent(elem, 'd2l-localize-behavior-language-changed');
				expect(elem.$$('.text').innerText).to.equal('Bonjour Mary');
			});

			it('should not throw when a parameter is missing', () => {
				let val;
				expect(() => {
					val = elem.localize('hello', 'invalidParam', 'Bill');
				}).to.not.throw();
				expect(val).to.equal('Hello {name}');
				const errArg = errorSpy.firstCall.args[0];
				expect(errArg).to.be.instanceof(Error);
				expect(errArg.message).to.equal('The intl string context variable "name" was not provided to the string "Hello {name}"');
			});

		});
	});
});
