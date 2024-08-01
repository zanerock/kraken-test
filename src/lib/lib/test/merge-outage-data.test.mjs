import { stdout } from 'stdout-stderr'

import { mergeOutageData } from '../merge-outage-data'

const dev1ID = '002b28fc-283c-47ec-9af2-ea287336dc1b'
const cutoffTime = new Date('2022-01-01T00:00:00.000Z')

describe('mergeOutageData', () => {
  beforeAll(stdout.start)
  afterAll(stdout.stop)

  const siteInfo = {
    id      : 'kingfisher',
    name    : 'KingFisher',
    devices : [
      {
        id   : dev1ID,
        name : 'Battery 1'
      },
      {
        id   : '086b0d53-b311-4441-aaf3-935646f03d4d',
        name : 'Battery 2'
      }
    ]
  }

  test('handles outages with no ID', () => {
    const outages = [
      {
        id    : dev1ID,
        begin : '2022-07-26T17:09:31.036Z',
        end   : '2022-08-29T00:37:42.253Z'
      },
      {
        id    : '',
        begin : '2022-05-23T12:21:27.377Z',
        end   : '2022-11-13T02:16:38.905Z'
      },
      {
        begin : '2022-05-23T12:21:27.377Z',
        end   : '2022-11-13T02:16:38.905Z'
      }
    ]

    const mergedData = mergeOutageData({ cutoffTime, outages, siteInfo })
    expect(mergedData).toHaveLength(1)
    expect(mergedData[0].id).toBe(dev1ID)
  })

  test('removes outages before cutoff time', () => {
    const outages = [
      {
        id    : dev1ID,
        begin : '2021-07-26T17:09:31.036Z',
        end   : '2021-08-29T00:37:42.253Z'
      }
    ]

    const mergedData = mergeOutageData({ cutoffTime, outages, siteInfo })
    expect(mergedData).toHaveLength(0)
  })

  test('includes outages at and after cutoff time', () => {
    const nextDay = new Date(cutoffTime)
    nextDay.setDate(nextDay.getDate() + 1)
    const outages = [
      {
        id    : dev1ID,
        begin : '2022-07-26T17:09:31.036Z',
        end   : '2022-08-29T00:37:42.253Z'
      },
      {
        id    : dev1ID,
        begin : cutoffTime.toISOString(),
        end   : nextDay.toISOString()
      }
    ]

    const mergedData = mergeOutageData({ cutoffTime, outages, siteInfo })
    expect(mergedData).toHaveLength(2)
  })
})
