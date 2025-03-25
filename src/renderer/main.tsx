import { lazy } from 'react'
import { createRoot } from 'react-dom/client'
import hotKey from 'licia/hotKey'
import log from 'share/common/log'
import { i18n } from '../common/util'
import { isDev, getPlatform } from 'share/common/util'
import 'luna-toolbar/css'
import 'luna-tab/css'
import 'luna-notification/css'
import 'luna-modal/css'
import './luna.scss'
import './icon.css'
import 'share/renderer/main.scss'
import './main.scss'

if (!isDev()) {
  log.setLevel('info')
}
const logger = log('renderer')
logger.info('start')

function renderApp() {
  logger.info('render app')

  const container: HTMLElement = document.getElementById('app') as HTMLElement

  const App = lazy(() => import('./main/App.js') as Promise<any>)
  const title = 'HARO'

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
