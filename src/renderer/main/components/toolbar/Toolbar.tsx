import Target from './Target'
import Tabs from './Tabs'
import Style from './Toolbar.module.scss'

export default function Toolbar() {
  return (
    <div className={Style.container}>
      <Target />
      <Tabs />
    </div>
  )
}
