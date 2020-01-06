> Building LitElement components? Use [BrightspaceUI/core](https://github.com/BrightspaceUI/core) instead.

# d2l-localize-behavior
[![Bower version][bower-image]][bower-url]
[![Build status][ci-image]][ci-url]

[Polymer](https://www.polymer-project.org) mixin for localization of text, dates, times, numbers and file sizes. Also supports automatic language resolution, timezone and locale overrides.

For further information on this and other components, refer to [The Brightspace UI Guide](https://github.com/BrightspaceUI/guide/wiki).

## Installation

`d2l-localize-behavior` can be installed from [Bower][bower-url]:

```shell
bower install d2l-localize-behavior
```

## Usage

Place your language resources as a collection property called `resources`.

```javascript
import 'd2l-localize-behavior/d2l-localize-behavior.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';

class MyElement extends mixinBehaviors([
  D2L.PolymerBehaviors.LocalizeBehavior
]), PolymerElement) {

  static get template() {
    return html`<p>{{localize('hello')}}</p>`;
  }

  static get properties() {
    return {
      resources: {
        value: function() {
          return {
            'de': { 'hello': 'Hallo' },
            'en': { 'hello': 'Hello' },
            'en-ca': { 'hello': 'Hello, eh' },
            'es': { 'hello': 'Hola' },
            'fr': { 'hello': 'Bonjour' }
          };
        }
      }
    }
  }
}
```

### Language Resources

* Always provide entries for base languages (e.g. "en", "fr", "pt") so that if the user is using a regional language (e.g. "en-gb", "fr-ca", "pt-br") which is missing, it can fall back to the base language.
* If there's no entry for a particular language, and no base language, the value of `data-lang-default` on the `<html>` element will be used.
* If no `data-lang-default` is specified, "en" will be used as a last resort.

### Numbers, File Sizes, Dates and Times

While `localize-behavior` does support formatting and parsing numbers, dates and times, instead please use the [https://github.com/BrightspaceUI/intl/](BrightspaceUI/intl) library directly.

## Developing, Testing and Contributing

After cloning the repo, run `npm install` to install dependencies.

If you don't have it already, install the [Polymer CLI](https://www.polymer-project.org/2.0/docs/tools/polymer-cli) globally:

```shell
npm install -g polymer-cli
```

To start a [local web server](https://www.polymer-project.org/2.0/docs/tools/polymer-cli-commands#serve) that hosts the demo page and tests:

```shell
polymer serve
```

To lint ([eslint](http://eslint.org/) and [Polymer lint](https://www.polymer-project.org/2.0/docs/tools/polymer-cli-commands#lint)):

```shell
npm run lint
```

To run unit tests locally using [Polymer test](https://www.polymer-project.org/2.0/docs/tools/polymer-cli-commands#tests):

```shell
polymer test --skip-plugin sauce
```

To lint AND run local unit tests:

```shell
npm test
```

[bower-url]: http://bower.io/search/?q=d2l-localize-behavior
[bower-image]: https://badge.fury.io/bo/d2l-localize-behavior.svg
[ci-url]: https://travis-ci.com/BrightspaceUI/localize-behavior
[ci-image]: https://travis-ci.com/BrightspaceUI/localize-behavior.svg
