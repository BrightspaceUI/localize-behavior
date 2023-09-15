import '../d2l-localize-behavior.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';

class TestLocalizeBehaviorDynamic extends mixinBehaviors([
	D2L.PolymerBehaviors.LocalizeBehavior
], PolymerElement) {

	static get properties() {
		return {
			computed: {
				type: String,
				value: '',
				computed: '_getComputedText(name)'
			},
			date: {
				type: Date,
				value: new Date()
			},
			name: {
				type: String
			}
		};
	}

	localizeConfig = {
		importFunc: async lang => (await import(`./lang/${lang}.js`)).default
	};

	static get template() {
		return html`
			<p>Text: <span class="text">[[localize('hello', 'name', name)]]</span></p>
			<p>Number: <span class="number">[[formatNumber(1234567.890)]]</span></p>
			<p>Date: <span class="date">[[formatDate(date)]]</span></p>
			<p>Time: <span class="time">[[formatTime(date)]]</span></p>
			<p>Date &amp; time: <span class="date-time">[[formatDateTime(date)]]</span></p>
			<p>File size: <span class="file-size">[[formatFileSize(1234567.89)]]</span></p>
		`;
	}

	_getComputedText(name) {
		return `${this.formatNumber(5.2)}-${name}`;
	}
}

customElements.define('d2l-test-localize-behavior-dynamic', TestLocalizeBehaviorDynamic);
