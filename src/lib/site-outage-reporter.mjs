import { getConfiguredAPIKey } from './lib/get-configured-api-key'
import { KrakenSystem } from './lib/kraken-system'
import { mergeOutageData } from './lib/merge-outage-data'

const siteOutageReporter = async function ({
  apiKey = this?.apiKey,
  // if this were a real tool, we would default to something like ~/.config/enhanced-outage-reporter/, but for the test
  // this is actually more user friendly
  configPath = this?.configPath || process.cwd(),
  // if this were real, we would probably leave these undefined if not set
  cutoffTime = this?.cutoffTime || '2022-01-01T00:00:00.000Z',
  siteId = this?.siteId || 'norwich-pear-tree'
} = {}) {
  if (apiKey === undefined) {
    apiKey = await getConfiguredAPIKey(configPath) // handle error conditions internally
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
