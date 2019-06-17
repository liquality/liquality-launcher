const fs = require('fs')
const path = require('path')

const store = require('./store')
const { updateConfig, watchConfig, watchCustomConfigFile } = require('./configUpdater')
const { extractZip, download, getSwapInterfacePath } = require('./utils')
const { app, dialog } = require('electron')
const { createServer } = require('http-server')
const { createTray, readyTray } = require('./tray')
const constants = require('./constants')
const { getLatestRelease } = require('./release')

let swapUIServer
let tray

function createSwapDirectory () {
  const swapInterfacePath = path.join(app.getPath('userData'), 'liquality-swap')
  if (!fs.existsSync(swapInterfacePath)) {
    fs.mkdirSync(swapInterfacePath)
  }
}

async function setupSwapInterface () {
  const release = await getLatestRelease()
  const version = release.tag_name.split('v')[1]
  if (store.has('swapInterface.version')) {
    const runningVersion = store.get('swapInterface.version')
    if (runningVersion === version) return
  }
  const downloadUrl = release.assets[0].browser_download_url
  const downlodaName = release.assets[0].name
  const targetPath = path.join(app.getPath('userData'), 'liquality-swap')
  const zipTargetPath = path.join(targetPath, downlodaName)
  await download(downloadUrl, zipTargetPath)
  await extractZip(zipTargetPath, { dir: targetPath })
  fs.unlinkSync(zipTargetPath)
  store.set('swapInterface.version', version)
}

async function setupSwapInterfaceServer () {
  swapUIServer = createServer({
    root: getSwapInterfacePath(),
    cache: -1
  })

  swapUIServer.listen(constants.PORT)
}

async function run () {
  createSwapDirectory()
  await setupSwapInterface()
  await setupSwapInterfaceServer()
  updateConfig()
  watchConfig()
  watchCustomConfigFile()
  tray = readyTray(tray)
  dialog.showMessageBox(null, {
    type: 'warning', message: 'The default configuration uses Liquality owned nodes to operate for convenience. For the utmost reliability and security, select your own configuration!'
  })
}

(async () => {
  run()
})()

app.on('ready', () => {
  tray = createTray()
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.dock.hide()
