const mergeOutageData = ({ cutoffTime, outages, siteInfo }) => {
  process.stdout.write('Merging data...\n')

  // produce a map of the device IDs to names so we don't have to be searching the lists every time
  const deviceIDToNameMap = siteInfo.devices.reduce((map, { id, name }) => { map[id] = name; return map }, {})

  const siteOutageData = outages.reduce((siteOutageData, outage) => {
    const { begin, id } = outage
    const deviceName = deviceIDToNameMap[id]
    if (deviceName !== undefined) { // this will also remove outages with no ID
      const beginDate = new Date(begin)
      if (beginDate >= cutoffTime) {
        outage.name = deviceName
        siteOutageData.push(outage)
      }
    }
    return siteOutageData
  }, [])

  return siteOutageData
}

export { mergeOutageData }
