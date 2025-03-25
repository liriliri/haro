import { FC, PropsWithChildren, useState } from 'react'
import Toolbar from './components/toolbar/Toolbar'
import Style from './App.module.scss'
import { observer } from 'mobx-react-lite'
import store from './store'
import Overview from './components/overview/Overview'
import Screenshot from './components/screenshot/Screenshot'

export default observer(function App() {
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
          <Panel panel="screenshot">
            <Screenshot />
          </Panel>
        </div>
      </div>
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
