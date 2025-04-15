import Screencast from './components/Screencast'
import Toolbar from './components/Toolbar'
import { observer } from 'mobx-react-lite'
import store from './store'

export default observer(function App() {
  return (
    <>
      <Toolbar />
      {store.target && <Screencast key={store.target.key} />}
    </>
  )
})
