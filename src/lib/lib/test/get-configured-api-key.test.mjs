import * as fs from 'node:fs/promises'
import { sep as pathSep } from 'node:path'

import { getConfiguredAPIKey } from '../get-configured-api-key'

jest.mock('node:fs/promises', () => ({
  readFile : jest.fn()
}))

describe('getConfiguredAPIKey', () => {
  test('retrieves API key when file is found', async () => {
    const testKey = '1234567890'
    // fsMock.readFile = jest.fn(async () => { return key })
    fs.readFile.mockImplementation(async () => { return testKey })

    const key = await getConfiguredAPIKey('.')
    expect(key).toBe(testKey)
  })

  test('throws an error if the key is empty', async () => {
    // fsMock.readFile = jest.fn(async () => { return key })
    fs.readFile.mockImplementation(async () => { return '' })

    try {
      await getConfiguredAPIKey('.')
      throw new Error('Did not raise exception')
    } catch (e) {}
  })

  test('reports missing file location if not found', async () => {
    // fsMock.readFile = jest.fn(async () => { return key })
    fs.readFile.mockImplementation(async () => { const err = new Error('not found'); err.code = 'ENOENT'; throw err })

    try {
      await getConfiguredAPIKey(pathSep + 'tmp')
      throw new Error('Did not raise exception')
    } catch (e) {
      expect(e.message).toMatch(new RegExp(`Did not find.*${pathSep}tmp/api-key.txt`))
    }
  })
})
