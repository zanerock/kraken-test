import { stdout } from 'stdout-stderr'

import { smartFetch } from '../smart-fetch'

const status500Result = {
  ok     : false,
  status : 500,
  json   : async () => ({ message : 'failure!' })
}
const testOptions = {
  apiKey     : '123',
  url        : 'https://foo.com',
  retryDelay : 1
}

describe('smartFetch', () => {
  beforeAll(() => { stdout.start() })
  afterAll(() => { stdout.stop() })

  test('returns JSON after successful attempt', async () => {
    const json = [1, 2]
    const fetch = jest.fn(async () => ({
      ok     : true,
      status : 200,
      json   : jest.fn(async () => json)
    }))

    const result = await smartFetch({ ...testOptions, fetch })
    expect(result).toEqual(json)
  })

  test('can get result after successful retry', async () => {
    const json = [1, 2]
    const firstResult = status500Result
    const secondResult = {
      ok     : true,
      status : 200,
      json   : jest.fn(async () => json)
    }
    let callCount = 0
    const fetch = jest.fn(async () => {
      callCount += 1
      return callCount === 1 ? firstResult : secondResult
    })

    const result = await smartFetch({ ...testOptions, fetch })
    expect(result).toEqual(json)
  })

  test('quits after 1 + 3 retries', async () => {
    const fetch = jest.fn(async () => status500Result)

    try {
      await smartFetch({ ...testOptions, fetch })
    } catch (e) {
      expect(fetch.mock.calls).toHaveLength(4)
    }
  })
})
