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

  async getSiteInfo (siteId) {
    return smartFetch({ apiKey : this.apiKey, url : baseURL + `/site-info/${siteId}` })
  }

  async postSiteOutages (siteId, siteOutageData) {
    const postOptions = { body : JSON.stringify(siteOutageData), method : 'POST' }
    return smartFetch({ apiKey : this.apiKey, url : baseURL + '/site-outages/' + siteId, options : postOptions })
  }
}

export { KrakenSystem }
