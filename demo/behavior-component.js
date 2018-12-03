import '@polymer/polymer/polymer-legacy.js';
import '../d2l-localize-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-behavior-component">
	<template strip-whitespace="">
		<p>Text: [[localize('hello')]]</p>
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
					'ar': { 'hello': 'مرحبا' },
					'de': { 'hello': 'Hallo' },
					'en': { 'hello': 'Hello' },
					'en-CA': { 'hello': 'Hello, eh' },
					'es': { 'hello': 'Hola' },
					'fr': { 'hello': 'Bonjour' },
					'ja': { 'hello': 'こんにちは' },
					'ko': { 'hello': '안녕하세요' },
					'pt-BR': { 'hello': 'Olá' },
					'sv': { 'hello': 'Hallå' },
					'tr': { 'hello': 'Merhaba' },
					'zh-CN': { 'hello': '你好' },
					'zh-TW': { 'hello': '你好' }
				};
			}
		}
	}
});
