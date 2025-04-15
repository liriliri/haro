import { lazy } from 'react'
import { createRoot } from 'react-dom/client'
import hotKey from 'licia/hotKey'
import log from 'share/common/log'
import { i18n, t } from '../common/util'
import { isDev, getPlatform } from 'share/common/util'
import 'luna-toolbar/css'
import 'luna-tab/css'
import 'luna-notification/css'
import 'luna-modal/css'
import 'luna-image-viewer/css'
import 'luna-setting/css'
import 'luna-icon-list/css'
import 'luna-data-grid/css'
import 'luna-command-palette/css'
import 'luna-dom-viewer/css'
import './luna.scss'
import './icon.css'
import 'share/renderer/main.scss'
import './main.scss'
import getUrlParam from 'licia/getUrlParam'

const logger = log('renderer')
logger.info('start')

function renderApp() {
  logger.info('render app')

  const container: HTMLElement = document.getElementById('app') as HTMLElement

  let App = lazy(() => import('./main/App.js') as Promise<any>)
  let title = 'ECHO'

  switch (getUrlParam('page')) {
    case 'terminal':
      App = lazy(() => import('share/renderer/terminal/App.js') as Promise<any>)
      title = t('terminal')
      break
    case 'screencast':
      App = lazy(() => import('./screencast/App.js') as Promise<any>)
      title = t('screencast')
      break
  }

  preload.setTitle(title)

  createRoot(container).render(<App />)
}

if (isDev()) {
  hotKey.on('f5', () => location.reload())
  hotKey.on('f12', () => main.toggleDevTools())
}

;(async function () {
  const language = await main.getLanguage()
  i18n.locale(language)

  document.body.classList.add(`platform-${getPlatform()}`)

  renderApp()
})()
