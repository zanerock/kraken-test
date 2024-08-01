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


##  API Reference
_API generated with [dmd-readme-api](https://www.npmjs.com/package/dmd-readme-api)._

<a id="siteOutageReporter"></a>
### `siteOutageReporter(options)`

Creates and posts an enhanced outage report for a particular site.


| Param | Type | Description |
| --- | --- | --- |
| options | `object` | The options. |
| options.apiKey | `string` | The API key to use to contact the Kraken system. If no API key is given, the   function will search `configDir` for an `api-key.txt` file and treat the contents of that file as the API key. |
| options.configDir | `string` | The directory where `api-key.txt` can be found, if needed. Defaults to   `process.cwd()`. |
| options.cutoffTime | `Date` | The earliest outage time to include in the site outage report. Defaults to   '2022-01-01T00:00:00.000Z'. |
| options.siteId | `string` | The site to generate the site outage report for. Default to 'norwich-pear-tree'. |


[**Source code**](./src/lib/site-outage-reporter.mjs#L16)

## Command line reference

### Usage

`site-outage-reporter <options>`

### Options

|Option|Description|
|------|------|
|`--api-key`|(_string_, _opt_) The API key to use in contacting the Kraken system. If not provided, will search the current working dir for 'api-key.txt' and use it's contents as the key.|
|`--cutoff-time`|(_DateTime_, _opt_, default: 2022-01-01T00:00:00.000Z) The earliest outage (beginning) to include in the site outage report. Will accept many formats including '2022-01-01T00:00:00.000Z', '1 Jan 2022 00:00:00 Z,', '2022-01-01 00:00:00 Z', etc.|
|`--site-id`|(_string_, _opt_, default: norwich-pear-tree) The site ID for which to generate the report.|
|`--throw-error`|(_bool_, _opt_) If set, will throw an error instead of simply reporting the message. Useful for debugging.|
## Developer notes

- In order to make things "real-ish", you con supply an API key as a CLI option (or pass it in if using the library), but it will also look for the a 'api-key.txt' file in the current working dir and read the API from there, as would be standard practice. (If this were real, I'd actually default the file location to `~/.config/site-outage-reporter` or something.)
- Besides the key reading function, the other two interesting functions are the `mergeOutageData`, which combines the outage and site data for the site outage report, and `smartFetch` which surrounds the standard `fetch` with retry logic to handle 500 and other errors.
- Since it's a CLI tool and as a user tools that just silently do stuff are spooky, I made it chatty so it tells you what it's doing as it goes along. If this were a real project, I would have used some kind of logger for the output and included a `--quiet` option.
- I use a set of SDLC tools that I developed to setup standard infrastructure. I went ahead and use this for this project because, why not? Among other things:
  - This sets up the build (make files) and installs standard configurations I use for Babel+Rollup, Jest, and ESLint.
  - The tool also ensures that everything passes QA before work can be submitted.
  - It builds ESM and CJS versions of the library files, taking into account the `package.json` `engines` designation.
  - When submitted, the tool generates a configurable attestation in the pull request and also links to all the QA artifacts. You can see this in the [pull request](https://github.com/zanerock/kraken-test/issues/3).
  - Can automatically generate 'coverage' and CI/CD badges.
  - Automatically generates a simple CI/CD unit test to run on multiple platforms and node versions.
- The [API reference](#api-reference) section is built using jsdoc-to-markdown and a custom DMD (output formatter) that I wrote to optimize for this use case ([dmd-readme-api](https://www.npmjs.com/package/dmd-readme-api)). Among other things, it has the cool feature of linking the documentation for a function to the source code where the function is defined.
- I also went ahead and enabled the CLI tool to take in options for different cutoff times and site IDs. It defaults to the values in the work spec, but is to demonstrate the how I'd develop things, I wanted to make a "real-ish" CLI and also include standard CLI docs, generated from the options spec. The CLI docs are generated by another tool I wrote: [command-line-documentation](https://www.npmjs.com/package/command-line-documentation).
- Speaking of options, I also used a library I just recently wrote, [string-input](https://www.npmjs.com/package/string-input) which, among other things, includes a robust `DateTime` processor which cane take in many different date time formats and integrates with command-line-args. I figure since I had it handy, why not.
- As mentioned before, I normally wouldin't include the `./dist` dir in the git repo, but since the build relies on `make` and I don't assume that's available on every system, I included `./dist` for convenience.
- For testing, I focused on they two key, and most complicated bits, the merge logic (which is central, and so important to check), and the 'smart fetch' function. I also did some testing around the options processing and ingesting different date formats, as well as the API key file reading logic. I didn't test the 'kraken server', since all the functions are just simple wrappers with no real logic that just feed constants to the smart fetch routine, nor did I test the main routine as it just does straightforward, linear calls of tho other functions and doesn't have any non-trivial logic. Where this a real project, I probably would have done a couple simple tests and it's always nice to get 100% code coverage.