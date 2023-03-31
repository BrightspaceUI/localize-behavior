> Building Lit components? Use [BrightspaceUI/core](https://github.com/BrightspaceUI/core) instead.

# @brightspace-ui/localize-behavior

[Polymer](https://www.polymer-project.org) mixin for localization of text, dates, times, numbers and file sizes. Also supports automatic language resolution, timezone and locale overrides.

## Installation

Install from NPM:

```shell
npm install @brightspace-ui/localize-behavior
```

## Usage

Place your language resources as a collection property called `resources`.

```javascript
import '@brightspace-ui/localize-behavior/d2l-localize-behavior.js';
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

## Versioning & Releasing

> TL;DR: Commits prefixed with `fix:` and `feat:` will trigger patch and minor releases when merged to `main`. Read on for more details...

The [semantic-release GitHub Action](https://github.com/BrightspaceUI/actions/tree/main/semantic-release) is called from the `release.yml` GitHub Action workflow to handle version changes and releasing.

### Version Changes

All version changes should obey [semantic versioning](https://semver.org/) rules:
1. **MAJOR** version when you make incompatible API changes,
2. **MINOR** version when you add functionality in a backwards compatible manner, and
3. **PATCH** version when you make backwards compatible bug fixes.

The next version number will be determined from the commit messages since the previous release. Our semantic-release configuration uses the [Angular convention](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular) when analyzing commits:
* Commits which are prefixed with `fix:` or `perf:` will trigger a `patch` release. Example: `fix: validate input before using`
* Commits which are prefixed with `feat:` will trigger a `minor` release. Example: `feat: add toggle() method`
* To trigger a MAJOR release, include `BREAKING CHANGE:` with a space or two newlines in the footer of the commit message
* Other suggested prefixes which will **NOT** trigger a release: `build:`, `ci:`, `docs:`, `style:`, `refactor:` and `test:`. Example: `docs: adding README for new component`

To revert a change, add the `revert:` prefix to the original commit message. This will cause the reverted change to be omitted from the release notes. Example: `revert: fix: validate input before using`.

### Releases

When a release is triggered, it will:
* Update the version in `package.json`
* Tag the commit
* Create a GitHub release (including release notes)
* Deploy a new package to NPM

### Releasing from Maintenance Branches

Occasionally you'll want to backport a feature or bug fix to an older release. `semantic-release` refers to these as [maintenance branches](https://semantic-release.gitbook.io/semantic-release/usage/workflow-configuration#maintenance-branches).

Maintenance branch names should be of the form: `+([0-9])?(.{+([0-9]),x}).x`.

Regular expressions are complicated, but this essentially means branch names should look like:
* `1.15.x` for patch releases on top of the `1.15` release (after version `1.16` exists)
* `2.x` for feature releases on top of the `2` release (after version `3` exists)
