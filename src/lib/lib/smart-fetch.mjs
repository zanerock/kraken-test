import fetchRetry from 'fetch-retry'

const retryCount = 3
const defaultRetryDelay = 1000 // ms

const smartFetch = async ({ apiKey, url, fetch = global.fetch, retryDelay = defaultRetryDelay, options }) => {
  fetch = fetchRetry(fetch)

  const method = options?.method || 'GET'
  process.stdout.write(`Calling ${method} ${url}...\n`)

  const fetchOptions = { headers : { 'x-api-key' : apiKey }, retryDelay }
  Object.assign(fetchOptions, options)
  fetchOptions.retryOn = (attempt, error, response) => { // first attempt is 0
    // retry on any network error, or retry-able 400 or 5xx status codes
    const { status } = response
    if (error !== null || (status === 408 || status === 409 || status === 429 || status >= 500)) {
      if (attempt < retryCount) {
        if (error !== null) {
          process.stdout.write('Error reported: ' + error.message + '\n')
        }
        process.stdout.write(`retrying (got status: ${response.status}); attempt ${attempt + 1} of ${retryCount}...\n`)
        return true
      } else {
        process.stdout.write('retry count exceeded\n')
      }
    }
    return false
  }

  const response = await fetch(url, fetchOptions)
  const data = await response.json() // we get JSON data for bad response too
  if (response.ok === false) {
    throw new Error(`Call failed (status: ${response.status}${data?.message ? '; message: ' + data.message : ''}).`)
  } else {
    process.stdout.write('request complete\n')
  }

  return data
}

export { smartFetch }
