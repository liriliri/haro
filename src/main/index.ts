import { app } from 'electron'
import * as ipc from 'share/main/lib/ipc'
import * as main from './window/main'
import * as language from 'share/main/lib/language'
import * as theme from 'share/main/lib/theme'
import * as hdc from './lib/hdc'
import { setupTitlebar } from 'custom-electron-titlebar/main'
import log from 'share/common/log'
import { isDev } from 'share/common/util'

if (!isDev()) {
  log.setLevel('info')
}
const logger = log('main')
logger.info('start')

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

app.setName('Haro')

app.on('ready', () => {
  logger.info('app ready')

  setupTitlebar()
  language.init()
  theme.init()
  hdc.init()
  ipc.init()
  main.showWin()
})
