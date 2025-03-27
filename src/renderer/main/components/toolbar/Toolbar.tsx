import Target from './Target'
import Tabs from './Tabs'
import Settins from './Settings'
import Style from './Toolbar.module.scss'

export default function Toolbar() {
  return (
    <div className={Style.container}>
      <Target />
      <Tabs />
      <Settins />
    </div>
  )
}
