const { app, Menu, Tray, shell, nativeImage } = require('electron')
const constants = require('./constants')
const store = require('./store')
const fs = require('fs')
const path = require('path')
const { getSwapInterfacePath, getCustomConfigPath, getCustomConfig } = require('./utils')

function createTray () {
  const tray = new Tray(nativeImage.createFromDataURL(constants.iconDataURL))
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Swap Interface Downloading...', enabled: false },
    { type: 'separator' },
    { label: 'Quit', click: app.quit }
  ])
  tray.setToolTip('Liquality Launcher')
  tray.setContextMenu(contextMenu)
  return tray
}

function readyTray (tray) {
  const swapPath = path.join(getSwapInterfacePath(), 'index.html')
  const configName = store.get('swapInterface.configName')
  const configMenu = Menu.buildFromTemplate([
    {
      label: 'Liquality.io Mainnet',
      type: 'radio',
      checked: configName === 'liquality.io.mainnet',
      click: () => {
        store.set('swapInterface.configName', 'liquality.io.mainnet')
        store.set('swapInterface.config', require('./configs/liquality.io.mainnet.config.json'))
      }
    },
    {
      label: 'Liquality.io Testnet',
      type: 'radio',
      checked: configName === 'liquality.io.testnet',
      click: () => {
        store.set('swapInterface.configName', 'liquality.io.testnet')
        store.set('swapInterface.config', require('./configs/liquality.io.testnet.config.json'))
      }
    },
    {
      label: 'Custom',
      type: 'radio',
      checked: configName === 'custom',
      click: () => {
        store.set('swapInterface.configName', 'custom')
        store.set('swapInterface.config', getCustomConfig())
      }
    },
    {
      label: 'Show Custom Config...',
      click: () => {
        shell.showItemInFolder(getCustomConfigPath())
        // TODO: Watch custom config path for updates.
      }
    }
  ])
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Swap Interface', enabled: false },
    {
      label: 'Open Swap Interface',
      click: () => {
        shell.openExternal(`http://localhost:${constants.PORT}`)
      }
    },
    { label: 'Swap Interface Configs', submenu: configMenu },
    {
      label: 'Show Source',
      click: () => {
        shell.showItemInFolder(swapPath)
      }
    },
    { type: 'separator' },
    { label: 'Quit', click: app.quit }
  ])
  tray.setContextMenu(contextMenu)
  return tray
}

module.exports = { createTray, readyTray }
