const { app } = require('electron')
const path = require('path')
const fs = require('fs')
const store = require('./store')
const { getCustomConfigPath, getCustomConfig } = require('./utils')

function watchCustomConfigFile () {
  fs.watch(getCustomConfigPath(), eventType => {
    if (eventType === 'change' && store.get('swapInterface.configName') === 'custom') {
      store.set('swapInterface.config', getCustomConfig())
    }
  })
}

function updateConfig () {
  const config = store.get('swapInterface.config')
  const version = store.get('swapInterface.version')
  const runtimeConfigPath = path.join(app.getPath('userData'), 'liquality-swap', `liquality-swap-${version}`, 'config.js')
  fs.writeFileSync(runtimeConfigPath, `window.config = ${JSON.stringify(config, null, 2)}`)
}

function watchConfig () {
  store.onDidChange('swapInterface.config', updateConfig)
}

module.exports = { updateConfig, watchConfig, watchCustomConfigFile }
