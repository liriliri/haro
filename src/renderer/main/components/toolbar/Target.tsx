import LunaToolbar, { LunaToolbarSelect } from 'luna-toolbar/react'
import types from 'licia/types'
import Style from './Target.module.scss'
import { observer } from 'mobx-react-lite'
import isEmpty from 'licia/isEmpty'
import store from '../../store'
import { t } from '../../../../common/util'
import each from 'licia/each'

export default observer(function Target() {
  let deviceOptions: types.PlainObj<string> = {}
  let deviceDisabled = false
  if (!isEmpty(store.targets)) {
    deviceOptions = {}
    each(store.targets, (target) => {
      deviceOptions[`${target.name} (${target.id})`] = target.id
    })
  } else {
    deviceOptions[t('deviceNotConnected')] = ''
    deviceDisabled = true
  }

  return (
    <>
      <LunaToolbar
        className={Style.container}
        onChange={(key, val) => {
          if (key === 'target') {
            store.selectTarget(val)
          }
        }}
      >
        <LunaToolbarSelect
          keyName="target"
          disabled={deviceDisabled}
          value={store.target ? store.target.id : ''}
          options={deviceOptions}
        />
      </LunaToolbar>
    </>
  )
})
