import { smartFetch } from './smart-fetch'

const baseURL = 'https://api.krakenflex.systems/interview-tests-mock-api/v1'

const KrakenSystem = class {
  constructor (apiKey) {
    this.apiKey = apiKey
  }

  async getOutages () {
    const outageData = await smartFetch({ apiKey : this.apiKey, url : baseURL + '/outages' })
    process.stdout.write(`Found ${outageData.length} outages...\n`)
    return outageData
  }
}

export { KrakenSystem }
