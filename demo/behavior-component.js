import '@polymer/polymer/polymer-legacy.js';
import '../d2l-localize-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-behavior-component">
	<template strip-whitespace="">
		<p>Text: [[localize('hello', 'name', 'Bill')]]</p>
		<p>Number: [[formatNumber(123456.789)]]</p>
		<p>Date: [[formatDate(date)]]</p>
		<p>Time: [[formatTime(date)]]</p>
		<p>Date &amp; time: [[formatDateTime(date)]]</p>
		<p>File size: [[formatFileSize(123456789)]]</p>
	</template>

</dom-module>`;

document.head.appendChild($_documentContainer.content);
Polymer({
	is: 'd2l-behavior-component',
	behaviors: [
		D2L.PolymerBehaviors.LocalizeBehavior
	],
	properties: {
		date: {
			type: Date,
			value: new Date()
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
	}
});
