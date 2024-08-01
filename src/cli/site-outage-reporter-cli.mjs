import commandLineArgs from 'command-line-args'
import { DateTime } from 'string-input'

import { cliSpec } from './cli-spec'
import { siteOutageReporter } from '../lib/site-outage-reporter'

const siteOutageReporterCLI = async ({ argv = process.argv } = {}) => {
  let options
  try {
    options = commandLineArgs(cliSpec.arguments, { argv, camelCase : true })

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
    if (options.throwError === true) {
      throw e
    } // else
    process.stdout.write(`ERROR: ${e.message}\n`)
  }
}

export { siteOutageReporterCLI }
