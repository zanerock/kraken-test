import { siteOutageReporter } from '../../lib/site-outage-reporter'
import { siteOutageReporterCLI } from '../site-outage-reporter-cli'

jest.mock('../../lib/site-outage-reporter', () => ({
  siteOutageReporter : jest.fn()
}))

describe('siteOutageReporterCLI', () => {
  describe('sets defaults', () => {
    let testOptions
    beforeAll(async () => {
      siteOutageReporter.mockImplementation(async (options) => { testOptions = options })
      await siteOutageReporterCLI({ argv : [] })
    })

    test('default cutoffTime', () => expect(testOptions.cutoffTime).toEqual(new Date('2022-01-01T00:00:00.000Z')))
    test('default siteID', () => expect(testOptions.siteID).toBe('norwich-pear-tree'))
  })
})