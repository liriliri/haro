import { FC, PropsWithChildren, useEffect, useState } from 'react'
import Toolbar from './components/toolbar/Toolbar'
import Style from './App.module.scss'
import { observer } from 'mobx-react-lite'
import store from './store'
import Overview from './components/overview/Overview'
import Screenshot from './components/screenshot/Screenshot'
import Application from './components/application/Application'
import { createPortal } from 'react-dom'
import LunaModal from 'luna-modal/react'
import { t } from '../../common/util'
import icon from '../assets/icon.png'

export default observer(function App() {
  const [aboutVisible, setAboutVisible] = useState(false)

  useEffect(() => {
    const showAbout = () => setAboutVisible(true)
    const offShowAbout = main.on('showAbout', showAbout)
    return () => {
      offShowAbout()
    }
  }, [])

  return (
    <>
      <Toolbar />
      <div className={Style.workspace}>
        <div
          className={Style.panels}
          key={store.target ? store.target.key : ''}
        >
          <Panel panel="overview">
            <Overview />
          </Panel>
          <Panel panel="application">
            <Application />
          </Panel>
          <Panel panel="screenshot">
            <Screenshot />
          </Panel>
        </div>
      </div>
      {createPortal(
        <LunaModal
          title={t('aboutHaro')}
          visible={aboutVisible}
          width={400}
          onClose={() => setAboutVisible(false)}
        >
          <div className={Style.about}>
            <img className={Style.icon} src={icon} />
            <div>HARO</div>
            <div>
              {t('version')} {HARO_VERSION}
            </div>
          </div>
        </LunaModal>,
        document.body
      )}
    </>
  )
})

interface IPanelProps {
  panel: string
}

const Panel: FC<PropsWithChildren<IPanelProps>> = observer(function Panel(
  props
) {
  const [used, setUsed] = useState(false)

  let visible = false

  if (store.panel === props.panel) {
    if (!used) {
      setUsed(true)
    }
    visible = true
  }

  const style: React.CSSProperties = {}
  if (!visible) {
    style.opacity = 0
    style.pointerEvents = 'none'
  }

  return (
    <div className={Style.panel} style={style}>
      {used ? props.children : null}
    </div>
  )
})
