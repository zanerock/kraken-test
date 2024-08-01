import commandLineArgs from 'command-line-args'
import { DateTime } from 'string-input'

import { siteOutageReporter } from '../lib/site-outage-reporter'

const siteOutageReporterCLI = async ({ argv = process.argv } = {}) => {
  try {
    const options = commandLineArgs([
      { name: 'api-key' },
      { name : 'cutoff-time', type : DateTime },
      { name : 'site-id' }
    ], { argv, camelCase : true })

    // set our defaults
    if (options.cutoffTime === undefined) {
      options.cutoffTime = DateTime('2022-01-01T00:00:00.000Z')
    }
    if (options.siteId === undefined) {
      options.siteId = 'norwich-pear-tree'
    }
    // now, convert DateTime to regular Date
    options.cutoffTime = options.cutoffTime.getDate()

    await siteOutageReporter(options)
  } catch (e) {
    process.stdout.write(`ERROR: ${e.message}\n`)
  }
}

export { siteOutageReporterCLI }
