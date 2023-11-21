> Building Lit components? Use [BrightspaceUI/core](https://github.com/BrightspaceUI/core) instead.

# @brightspace-ui/localize-behavior

[Polymer](https://www.polymer-project.org) mixin for localization of text, dates, times, numbers and file sizes. Also supports automatic language resolution, timezone and locale overrides.

## Installation

Install from NPM:

```shell
npm install @brightspace-ui/localize-behavior
```

## Usage

```javascript
import '@brightspace-ui/localize-behavior/d2l-localize-behavior.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';

class MyElement extends mixinBehaviors([
  D2L.PolymerBehaviors.LocalizeBehavior
], PolymerElement) {

  static get template() {
    return html`<p>[[localize('hello')]]</p>`;
  }

  localizeConfig: {
    importFunc: async lang => (await import(`./lang/${lang}.js`)).default
  }
}
```

### Language Resources

Store localization resources in their own directory with nothing else in it. There should be one JavaScript file for each supported locale.

```javascript
// lang/en.js
export default {
  hello: `Hello, {firstName}!`
};
```
```javascript
// lang/fr.js
export default {
  hello: `Bonjour, {firstName}!`
};
```

* Always provide files for base languages (e.g. "en", "fr", "pt") so that if the user is using an unsupported regional language (e.g. "en-au", "fr-ca", "pt-br") it can fall back to the base language.
* If there's no entry for a particular language, and no base language, the value of `data-lang-default` on the `<html>` element will be used.
* If no `data-lang-default` is specified, "en" will be used as a last resort.

### `localize()`

The `localize()` method is used to localize a piece of text in the component's `template`.

If the localized string contains arguments, pass them as additional parameters to `localize`:

```javascript
static get template() {
  return html`<p>[[localize('hello', 'firstName', 'Mary')]]</p>`;
}
```

### Numbers, File Sizes, Dates and Times

While `localize-behavior` does support formatting and parsing numbers, dates and times, instead please use the [https://github.com/BrightspaceUI/intl/](BrightspaceUI/intl) library directly.

## Developing

After cloning the repo, run `npm install` to install dependencies.

### Running the demos

To start a [@web/dev-server](https://modern-web.dev/docs/dev-server/overview/) that hosts the demo page and tests:

```shell
npm start
```

### Linting

```shell
npm run lint
```

### Testing

```shell
# lint & run headless unit tests
npm test

# unit tests only
npm run test:headless

# debug or run a subset of local unit tests
npm run test:headless:watch
```

### Versioning and Releasing

This repo is configured to use `semantic-release`. Commits prefixed with `fix:` and `feat:` will trigger patch and minor releases when merged to `main`.

To learn how to create major releases and release from maintenance branches, refer to the [semantic-release GitHub Action](https://github.com/BrightspaceUI/actions/tree/main/semantic-release) documentation.
