import '../demo/test-elem.js';
import '../d2l-localize-behavior.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';
import { stub } from 'sinon';

const basic = html`<d2l-test-localize-behavior name="Mary"></d2l-test-localize-behavior>`,
	langSet = html`<d2l-test-localize-behavior name="Mary" language="fr"></d2l-test-localize-behavior>`,
	enCa = html`<d2l-test-localize-behavior name="Mary" language="en-ca"></d2l-test-localize-behavior>`;

describe('d2l-localize-behavior', () => {
	let elem;
	const documentLocaleSettings = getDocumentLocaleSettings();

	afterEach(() => documentLocaleSettings.reset());

	describe('initial load', () => {

		it('should use "fallback" if no "lang" is present', async() => {
			documentLocaleSettings.fallbackLanguage = 'es';
			elem = await fixture(basic);
			if (!elem.resources) await oneEvent(elem, 'app-localize-resources-loaded');
			expect(elem.language).to.equal('es');
		});

		it('should use "lang" if no "fallback" is present', async() => {
			documentLocaleSettings.language = 'es';
			elem = await fixture(basic);
			if (!elem.resources) await oneEvent(elem, 'app-localize-resources-loaded');
			expect(elem.language).to.equal('es');
		});

		it('should use "fallback" if "lang" is missing', async() => {
			documentLocaleSettings.language = 'es-mx';
			documentLocaleSettings.fallbackLanguage = 'es';
			elem = await fixture(basic);
			if (!elem.resources) await oneEvent(elem, 'app-localize-resources-loaded');
			expect(elem.language).to.equal('es');
		});

		it('should use "lang" when "fallback" is missing', async() => {
			documentLocaleSettings.language = 'es';
			documentLocaleSettings.fallbackLanguage = 'es-mx';
			elem = await fixture(basic);
			if (!elem.resources) await oneEvent(elem, 'app-localize-resources-loaded');
			expect(elem.language).to.equal('es');
		});

		it('should use "lang" over "fallback" when both are valid', async() => {
			documentLocaleSettings.language = 'de';
			documentLocaleSettings.fallbackLanguage = 'es';
			elem = await fixture(basic);
			if (!elem.resources) await oneEvent(elem, 'app-localize-resources-loaded');
			expect(elem.language).to.equal('de');
		});

		it('should use default (en) if "lang" and "fallback" are missing', async() => {
			documentLocaleSettings.language = 'zz';
			documentLocaleSettings.fallbackLanguage = 'yy';
			elem = await fixture(basic);
			expect(elem.language).to.equal('en');
		});

		it('should use default (en) if "lang" and "fallback" are null', async() => {
			elem = await fixture(basic);
			expect(elem.language).to.equal('en');
		});

		it('should use regional if specified', async() => {
			documentLocaleSettings.language = 'en-gb';
			elem = await fixture(basic);
			if (!elem.resources) await oneEvent(elem, 'app-localize-resources-loaded');
			expect(elem.language).to.equal('en-gb');
		});

		it('should resolve with case of entry in resources, not on HTML element', async() => {
			documentLocaleSettings.language = 'en-GB';
			elem = await fixture(basic);
			expect(elem.language).to.equal('en-gb');
		});

		it('should use base language if regional is missing', async() => {
			documentLocaleSettings.language = 'en-ca';
			elem = await fixture(basic);
			expect(elem.language).to.equal('en');
		});

		it('should match language in a case-insensitive way', async() => {
			documentLocaleSettings.language = 'zH-Cn';
			elem = await fixture(basic);
			expect(elem.language).to.equal('zh-cn');
		});

	});

	describe('lang set', () => {

		it('should ignore "language" attribute and use default', async() => {
			elem = await fixture(langSet);
			if (!elem.resources) await oneEvent(elem, 'app-localize-resources-loaded');
			expect(elem.language).to.equal('en');
		});

		it('should ignore "language" attribute and use "lang"', async() => {
			documentLocaleSettings.language = 'de';
			elem = await fixture(langSet);
			expect(elem.language).to.equal('de');
		});

	});

	describe('mutations', () => {

		it('should update language if "lang" changes', async() => {
			elem = await fixture(basic);
			setTimeout(() => documentLocaleSettings.language = 'fr');

			await oneEvent(elem, 'd2l-localize-behavior-language-changed');
			expect(elem.language).to.equal('fr');
		});

		it('should update language if "lang" is not set and "fallback" changes', async() => {
			elem = await fixture(basic);
			if (!elem.resources) await oneEvent(elem, 'app-localize-resources-loaded');

			setTimeout(() => documentLocaleSettings.fallbackLanguage = 'de');

			await oneEvent(elem, 'd2l-localize-behavior-language-changed');
			expect(elem.language).to.equal('de');
		});

		it('should not update language if "lang" is set and "fallback" changes', async() => {
			const shouldNotBeCalled = () => { throw 'unexpected'; };
			documentLocaleSettings.language = 'fr';
			elem = await fixture(basic);
			if (!elem.resources) await oneEvent(elem, 'app-localize-resources-loaded');
			elem.addEventListener('d2l-localize-behavior-language-changed', shouldNotBeCalled);
			documentLocaleSettings.fallbackLanguage = 'de';
			await new Promise(resolve => setTimeout(resolve, 1000));
			elem.removeEventListener('d2l-localize-behavior-language-changed', shouldNotBeCalled);
		});

		it('should use default (en) if "lang" is removed', async() => {
			documentLocaleSettings.language = 'es';
			elem = await fixture(basic);
			if (!elem.resources) await oneEvent(elem, 'app-localize-resources-loaded');
			setTimeout(() => documentLocaleSettings.language = null);

			await oneEvent(elem, 'd2l-localize-behavior-language-changed');
			expect(elem.language).to.equal('en');
		});

		it('should use default (en) if "fallback" is removed', async() => {
			documentLocaleSettings.fallbackLanguage = 'es';
			elem = await fixture(basic);
			if (!elem.resources) await oneEvent(elem, 'app-localize-resources-loaded');
			setTimeout(() => documentLocaleSettings.fallbackLanguage = null);

			await oneEvent(elem, 'app-localize-resources-loaded');

			expect(elem.language).to.equal('en');
		});

	});

	describe('localize', () => {

		let errorSpy;
		beforeEach(async() => {
			elem = await fixture(enCa);
			if (!elem.resources) await oneEvent(elem, 'app-localize-resources-loaded');
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

	describe('date/time formatting and parsing', () => {

		const date = new Date(2017, 11, 1, 17, 13);

		beforeEach(async() => {
			elem = await fixture(enCa);
			elem.date = date;
		});

		it('should format a date using default format', () => {
			const val = elem.formatDate(date);
			expect(val).to.equal('12/1/2017');
		});

		it('should format a date using specified format', () => {
			const val = elem.formatDate(date, { format: 'full' });
			expect(val).to.equal('Friday, December 1, 2017');
		});

		it('should format date via data binding', () => {
			expect(elem.$$('.date').innerText).to.equal('12/1/2017');
		});

		it('should format a time using default format', () => {
			const val = elem.formatTime(date);
			expect(val).to.equal('5:13 PM');
		});

		it('should format a time using specified format', () => {
			const val = elem.formatTime(date, { format: 'full' });
			expect(val).to.equal('5:13 PM ');
		});

		it('should format time via data binding', () => {
			expect(elem.$$('.time').innerText).to.equal('5:13 PM');
		});

		it('should format a date/time using default format', () => {
			const val = elem.formatDateTime(date);
			expect(val).to.equal('12/1/2017 5:13 PM');
		});

		it('should format a date/time using specified format', () => {
			const val = elem.formatDateTime(date, { format: 'medium' });
			expect(val).to.equal('Dec 1, 2017 5:13 PM');
		});

		it('should format a date/time using data binding', () => {
			expect(elem.$$('.date-time').innerText).to.equal('12/1/2017 5:13 PM');
		});

		it('should parse a date', () => {
			const val = elem.parseDate('12/1/2017');
			expect(val.getFullYear()).to.equal(2017);
			expect(val.getMonth()).to.equal(11);
			expect(val.getDate()).to.equal(1);
		});

		it('should parse a time', () => {
			const val = elem.parseTime('5:13 PM');
			expect(val.getHours()).to.equal(17);
			expect(val.getMinutes()).to.equal(13);
		});

	});

	describe('number formatting and parsing', () => {

		it('should format a number using default format', () => {
			const val = elem.formatNumber(1234567.890);
			expect(val).to.equal('1,234,567.89');
		});

		it('should format a number rounding up', () => {
			const val = elem.formatNumber(1234567.890, { maximumFractionDigits: 0 });
			expect(val).to.equal('1,234,568');
		});

		it('should format a number with specified format', () => {
			const val = elem.formatNumber(0.189, { style: 'percent' });
			expect(val).to.equal('18.9 %');
		});

		it('should format a number using data binding', () => {
			expect(elem.$$('.number').innerText).to.equal('1,234,567.89');
		});

		it('should parse a number', () => {
			const val = elem.parseNumber('1234567.890');
			expect(val).to.equal(1234567.89);
		});

	});

	describe('file size formatting', () => {

		beforeEach(async() => {
			elem = await fixture(basic);
		});

		it('should format a file size', () => {
			const val = elem.formatFileSize(1234567.89);
			expect(val).to.equal('1.18 MB');
		});

		it('should format a file size using data binding', () => {
			expect(elem.$$('.file-size').innerText).to.equal('1.18 MB');
		});

	});

	describe('timezone', () => {

		it('should return timezone\'s name', async() => {
			documentLocaleSettings.timezone.name = 'Hello';
			elem = await fixture(basic);
			expect(elem.getTimezone().name).to.equal('Hello');
		});

		it('should return timezone\'s identifier', async() => {
			documentLocaleSettings.timezone.identifier = 'Hello';
			elem = await fixture(basic);
			expect(elem.getTimezone().identifier).to.equal('Hello');
		});

		it('should not fail if timezone data is missing', async() => {
			elem = await fixture(basic);
			expect(elem.getTimezone().name).to.equal('');
			expect(elem.getTimezone().identifier).to.equal('');
		});

	});

});
