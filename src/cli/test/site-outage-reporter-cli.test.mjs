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

  test.each([
    ['2022-01-02 12:30 Z', new Date('2022-01-02T12:30:00.000Z')],
    ['01-02-2022 12:30 Z', new Date('2022-01-02T12:30:00.000Z')],
    ['2 Jan 2022 12:30:30.123 Z', new Date('2022-01-02T12:30:30.123Z')],
  ])('accepts and parses cutoff time string %s', async (timeString, expectedTime) => {
    let testOptions
    siteOutageReporter.mockImplementation(async (options) => { testOptions = options })
    await siteOutageReporterCLI({ argv : ['--cutoff-time', timeString] })
    expect(testOptions.cutoffTime).toEqual(expectedTime)
  })

  test('sets siteID from argv', async () => {
    const siteID = 'abc'
    let testOptions
    siteOutageReporter.mockImplementation(async (options) => { testOptions = options })
    await siteOutageReporterCLI({ argv : ['--site-id', siteID] })
    expect(testOptions.siteID).toEqual(siteID)
  })
})