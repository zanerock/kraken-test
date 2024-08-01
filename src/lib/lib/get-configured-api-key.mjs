import { readFile } from 'node:fs/promises'
import { resolve as resolvePath } from 'node:path'

const getConfiguredAPIKey = async (configDir) => {
  // resolve so we can provide an unambiguous file location in any error report, even if 'configDir' is relative
  const apiKeyPath = resolvePath(configDir, 'api-key.txt')
  let apiKey
  try {
    apiKey = (await readFile(apiKeyPath, { encoding : 'utf8' })).trim()
  } catch (e) { // give a more useful error message than just "no such file"
    if (e.code === 'ENOENT') {
      throw new Error(`Did not find configured API key file '${apiKeyPath}'; configure default key or set API key option.`, { cause : e })
    } else {
      throw new Error(`Unknown error occurred while reading configured API key file '${apiKeyPath}' (${e.message}); verify file exists and is readable or set API key option.`, { cause : e })
    }
  }

  if (!apiKey) { // if this were real, we would have a defined API key format and check the string against that
    throw new Error(`Found API key file '${apiKeyPath}', but it was empty.`)
  }

  return apiKey
}

export { getConfiguredAPIKey }
