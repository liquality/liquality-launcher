const Store = require('electron-store')
const testnetConfig = require('./configs/liquality.io.testnet.config.json')

const store = new Store()

// Set defaults
if (!store.has('swapInterface.config')) {
  store.set('swapInterface.configName', 'liquality.io.testnet')
  store.set('swapInterface.config', testnetConfig)
}

module.exports = store
