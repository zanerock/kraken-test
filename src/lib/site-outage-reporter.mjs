import { getConfiguredAPIKey } from './lib/get-configured-api-key'

const siteOutageReporter = async function ({
  apiKey = this?.apiKey,
  // if this were a real tool, we would default to something like ~/.config/enhanced-outage-reporter/, but for the test
  // this is actually more user friendly
  configPath = this?.configPath || process.cwd(),
  // if this were real, we would probably leave these undefined if not set
  cutoffTime = this?.cutoffTime || '2022-01-01T00:00:00.000Z',
  siteID = this?.siteID || 'norwich-pear-tree'
} = {}) {
  if (apiKey === undefined) {
    apiKey = await getConfiguredAPIKey(configPath) // handle error conditions internally
  }

  console.log(apiKey)
}

export { siteOutageReporter }
