const request = require('request-promise-native')

async function getLatestRelease () {
  const result = await request({
    url: 'https://api.github.com/repos/liquality/liquality-swap/releases',
    json: true,
    headers: {
      'User-Agent': 'liquality'
    }
  })
  return result[0]
}

module.exports = { getLatestRelease }
