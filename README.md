# d2l-localize-behavior
[![Bower version][bower-image]][bower-url]
[![Build status][ci-image]][ci-url]

[Polymer](https://www.polymer-project.org) mixin wrapper around [app-localize-behavior](https://github.com/PolymerElements/app-localize-behavior), adding automatic language resolution from the document's `lang` attribute.

For further information on this and other Brightspace UI components, see the docs at [ui.developers.brightspace.com](http://ui.developers.brightspace.com/).

## Installation

`d2l-localize-behavior` can be installed from [Bower][bower-url]:

```shell
bower install d2l-localize-behavior
```

## Usage

Use this mixin in your web components the same way [app-localize-behavior](https://github.com/PolymerElements/app-localize-behavior) is used. Place your language resources as a collection property called `resources`. Unlike `app-localize-behavior`, don't specify a `language` property as it will be resolved automatically.

```html
<link rel="import" href="../d2l-localize-behavior/d2l-localize-behavior.html">
<dom-module id="my-elem">
  <template strip-whitespace>
    <p>{{localize('hello')}}</p>
  </template>
  <script>
    Polymer({
      is: 'my-elem',
      behaviors: [
        D2L.PolymerBehaviors.LocalizeBehavior
      ],
      properties: {
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
    });
  </script>
</dom-module>
```

Then consume your web component in a page which has the `lang` attribute set on the `<html>` element:

```html
<html lang="fr">
  <head>
    <link rel="import" href="my-elem.html">
  </head>
  <body>
    <my-elem></my-elem>
  </body>
</html>
```

If the language of the page changes (via an update to the `lang` attribute on `<html>`), the mixin will automatically detect the change and re-render the web component. It will fire the event `d2l-localize-behavior-language-changed` when this occurs.

### Language Resources

* Always provide entries for base languages (e.g. "en", "fr", "pt") so that if the user is using a regional language (e.g. "en-gb", "fr-ca", "pt-br") which is missing, it can fall back to the base language.
* If there's no entry for a particular language, and no base language, the value of `data-lang-default` on the `<html>` element will be used.
* If no `data-lang-default` is specified, "en" will be used as a last resort.

## Future Enhancements

* Ability to "merge" regional and base language values such that only regional overrides would be required
* Date, time and number parsing and formatting support

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
[ci-url]: https://travis-ci.org/BrightspaceUI/localize-behavior
[ci-image]: https://travis-ci.org/BrightspaceUI/localize-behavior.svg
