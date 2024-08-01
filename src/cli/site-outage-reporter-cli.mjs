import commandLineArgs from 'command-line-args'
import { DateTime } from 'string-input'

import { siteOutageReporter } from '../lib/site-outage-reporter'

const siteOutageReporterCLI = async () => {
  try {
    const options = commandLineArgs([
      { name : 'cutoff-time', type : DateTime },
      { name : 'site-id' }
    ], { camelCase : true })

    // set our defaults
    if (options.cutoffTime === undefined) {
      options.cutoffTime = '2022-01-01T00:00:00.000Z'
    }
    if (options.siteID === undefined) {
      options.siteID = 'norwich-pear-tree'
    }

    await siteOutageReporter(options)
  } catch (e) {
    process.stdout.write(`ERROR: ${e.message}\n`)
  }
}

export { siteOutageReporterCLI }
