import '@polymer/polymer/polymer-legacy.js';
import '../d2l-localize-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-test-localize-behavior-dynamic">
	<template strip-whitespace="">
		<p>Text: <span class="text">[[localize('hello', 'name', name)]]</span></p>
		<p>Number: <span class="number">[[formatNumber(1234567.890)]]</span></p>
		<p>Date: <span class="date">[[formatDate(date)]]</span></p>
		<p>Time: <span class="time">[[formatTime(date)]]</span></p>
		<p>Date &amp; time: <span class="date-time">[[formatDateTime(date)]]</span></p>
		<p>File size: <span class="file-size">[[formatFileSize(1234567.89)]]</span></p>
	</template>

</dom-module>`;

document.head.appendChild($_documentContainer.content);
Polymer({
	is: 'd2l-test-localize-behavior-dynamic',
	behaviors: [
		D2L.PolymerBehaviors.LocalizeBehavior
	],
	properties: {
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
	},
	localizeConfig: {
		importFunc: async lang => (await import(`./lang/${lang}.js`)).default
	},
	_getComputedText: function(name) {
		return `${this.formatNumber(5.2)}-${name}`;
	}
});
