import '@polymer/polymer/polymer-legacy.js';
import '../d2l-localize-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="test-elem">
	<template strip-whitespace="">
		<p class="text">{{localize('hello')}}</p><p class="number">{{formatNumber(number)}}</p>
		<p class="date">{{formatDate(date)}}</p>
		<p class="time">{{formatTime(date)}}</p>
		<p class="date-time">{{formatDateTime(date)}}</p>
		<p class="file-size">{{formatFileSize(number)}}</p>
	</template>
	
</dom-module>`;

document.head.appendChild($_documentContainer.content);
Polymer({
	is: 'test-elem',
	behaviors: [
		D2L.PolymerBehaviors.LocalizeBehavior
	],
	properties: {
		date: {
			type: Date,
			value: new Date()
		},
		number: {
			type: Number
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
