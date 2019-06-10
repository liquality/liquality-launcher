const { app } = require('electron')

module.exports = {
  PORT: 5555,
  appPath: app.getPath('userData')
}
