import { getConfiguredAPIKey } from './lib/get-configured-api-key'
import { KrakenSystem } from './lib/kraken-system'
import { mergeOutageData } from './lib/merge-outage-data'

/**
 * Creates and posts an enhanced outage report for a particular site.
 * @param {object} options - The options.
 * @param {string} options.apiKey - The API key to use to contact the Kraken system. If no API key is given, the
 *   function will search `configDir` for an `api-key.txt` file and treat the contents of that file as the API key.
 * @param {string} options.configDir - The directory where `api-key.txt` can be found, if needed. Defaults to
 *   `process.cwd()`.
 * @param {Date} options.cutoffTime - The earliest outage time to include in the site outage report. Defaults to
 *   '2022-01-01T00:00:00.000Z'.
 * @param {string} options.siteId - The site to generate the site outage report for. Default to 'norwich-pear-tree'.
 */
const siteOutageReporter = async function ({
  apiKey,
  // if this were a real tool, we would default to something like ~/.config/enhanced-outage-reporter/, but for the test
  // this is actually more user friendly
  configDir = process.cwd(),
  // if this were real, we would probably leave these undefined if not set
  cutoffTime = new Date('2022-01-01T00:00:00.000Z'),
  siteId = 'norwich-pear-tree'
} = {}) {
  if (apiKey === undefined) {
    apiKey = await getConfiguredAPIKey(configDir) // handle error conditions internally
  }

  process.stdout.write(`Attempting to report outages for ${siteId} at or before ${cutoffTime.toISOString()}...\n`)

  const krakenSystem = new KrakenSystem(apiKey)

  const outages = await krakenSystem.getOutages() // will raise an exception if there's a problem
  const siteInfo = await krakenSystem.getSiteInfo(siteId)

  const siteOutageData = mergeOutageData({ cutoffTime, outages, siteInfo })

  process.stdout.write(`Found ${siteOutageData.length} applicable site records...\n`)

  await krakenSystem.postSiteOutages(siteId, siteOutageData)

  console.log('Success')
}

export { siteOutageReporter }
