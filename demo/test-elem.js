import '@polymer/polymer/polymer-legacy.js';
import '../d2l-localize-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-test-localize-behavior">
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
	is: 'd2l-test-localize-behavior',
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
		},
		resources: {
			value: function() {
				return {
					'ar': { 'hello': 'مرحبا {name}' },
					'de': { 'hello': 'Hallo {name}' },
					'en': { 'hello': 'Hello {name}' },
					'en-CA': { 'hello': 'Hello,  {name} eh' },
					'es': { 'hello': 'Hola {name}' },
					'fr': { 'hello': 'Bonjour {name}' },
					'ja': { 'hello': 'こんにちは {name}' },
					'ko': { 'hello': '안녕하세요 {name}' },
					'pt-BR': { 'hello': 'Olá {name}' },
					'sv': { 'hello': 'Hallå {name}' },
					'tr': { 'hello': 'Merhaba {name}' },
					'zh-CN': { 'hello': '你好 {name}' },
					'zh-TW': { 'hello': '你好 {name}' }
				};
			}
		}
	},
	_getComputedText: function(name) {
		return `${this.formatNumber(5.2)}-${name}`;
	}
});
