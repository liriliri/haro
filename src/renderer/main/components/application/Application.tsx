import LunaToolbar, {
  LunaToolbarInput,
  LunaToolbarSeparator,
  LunaToolbarSpace,
} from 'luna-toolbar/react'
import { observer } from 'mobx-react-lite'
import { useEffect, useRef, useState } from 'react'
import store from '../../store'
import map from 'licia/map'
import isEmpty from 'licia/isEmpty'
import LunaIconList from 'luna-icon-list/react'
import defaultIcon from '../../../assets/default-icon.png'
import { t } from '../../../../common/util'
import ToolbarIcon from 'share/renderer/components/ToolbarIcon'

export default observer(function Application() {
  const [bundles, setBundles] = useState<string[]>([])
  const [filter, setFilter] = useState('')
  const iconsRef = useRef<any[]>([])

  const { target } = store

  useEffect(() => {
    refresh()
  }, [])

  async function refresh() {
    if (!target) {
      return
    }

    const bundles = await main.getBundles(target.key)
    setBundles(bundles)
    iconsRef.current = map(bundles, (bundle) => {
      return {
        name: bundle,
        src: defaultIcon,
      }
    })
  }

  return (
    <div className="panel-with-toolbar">
      <LunaToolbar className="panel-toolbar">
        <LunaToolbarInput
          keyName="filter"
          value={filter}
          placeholder={t('filter')}
          onChange={(val) => setFilter(val)}
        />
        <LunaToolbarSpace />
        <ToolbarIcon
          icon="zoom-in"
          title={t('zoomIn')}
          disabled={store.application.itemSize > 256 || isEmpty(bundles)}
          onClick={() => {
            const itemSize = Math.round(store.application.itemSize * 1.2)
            store.application.set('itemSize', itemSize)
          }}
        />
        <ToolbarIcon
          icon="zoom-out"
          title={t('zoomOut')}
          disabled={store.application.itemSize < 32 || isEmpty(bundles)}
          onClick={() => {
            const itemSize = Math.round(store.application.itemSize * 0.8)
            store.application.set('itemSize', itemSize)
          }}
        />
        <LunaToolbarSeparator />
        <ToolbarIcon
          icon="refresh"
          title={t('refresh')}
          disabled={!target}
          onClick={() => refresh()}
        />
      </LunaToolbar>
      <div className="panel-body">
        <LunaIconList
          icons={iconsRef.current}
          size={store.application.itemSize}
          filter={filter}
        />
      </div>
    </div>
  )
})
