import { DateTime } from 'string-input'

const cliSpec = {
  mainCommand : 'site-outage-reporter',
  arguments   : [
    {
      name        : 'api-key',
      description : "The API key to use in contacting the Kraken system. If not provided, will search the current working dir for 'api-key.txt' and use it's contents as the key."
    },
    {
      name        : 'cutoff-time',
      type        : DateTime,
      typeDesc    : 'DateTime',
      description : "The earliest outage (beginning) to include in the site outage report. Will accept many formats including '2022-01-01T00:00:00.000Z', '1 Jan 2022 00:00:00 Z,', '2022-01-01 00:00:00 Z', etc.",
      default     : '2022-01-01T00:00:00.000Z'
    },
    { name : 'site-id', description : 'The site ID for which to generate the report.', default : 'norwich-pear-tree' },
    {
      name        : 'throw-error',
      type        : Boolean,
      description : 'If set, will throw an error instead of simply reporting the message. Useful for debugging.'
    }
  ]
}

export { cliSpec }
