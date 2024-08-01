# kraken-test
[![coverage: 68%](./.readme-assets/coverage.svg)](https://github.com/zanerock/kraken-test/pulls?q=is%3Apr+is%3Aclosed) [![Unit tests](https://github.com/zanerock/kraken-test/actions/workflows/unit-tests-node.yaml/badge.svg)](https://github.com/zanerock/kraken-test/actions/workflows/unit-tests-node.yaml)

This is a toy application developed for my Octopus Energy application.

- [Install](#install)
- [Usage](#usage)
- [API reference](#api-reference)
- [Command line reference](#command-line-reference)
- [Developer notes](#developer-notes)

## Install

```bash
# Of course, if this were real it'd be published to npmjs.org and you'd 'npm install' the package
git clone git+ssh://git@github.com/zanerock/kraken-test.git
npm run build # optional
```

The build uses make, which I don't assume will be installed on the user's system. So, I've committed the `dist` directory so you don't _need_ to build the app. (Normally, I would not include `dist` in the git repo.)

## Usage

To use the library:
```javascript
// Of course, if this were real, you'd import/require the NPM package rather than ref the git clone
import { siteOutageReporter } from '../path/to/checkout' // ESM
// const { siteOutageReporter } = require(../path/to/checkout) // CJS

siteOutageReporter({ apiKey : 'abcd123' })
```

To use the CLI:
```bash
# from the github clone
npx site-outage-reporter --api-key abc123
# or, create 'api-key.txt' in the working dir and just run:
# npx site-outage-reporter
```

