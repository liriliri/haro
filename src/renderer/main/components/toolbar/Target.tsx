import LunaToolbar, { LunaToolbarSelect } from 'luna-toolbar/react'
import types from 'licia/types'
import Style from './Target.module.scss'
import { observer } from 'mobx-react-lite'
import isEmpty from 'licia/isEmpty'
import store from '../../store'
import { t } from '../../../../common/util'
import each from 'licia/each'

export default observer(function Target() {
  let targetOptions: types.PlainObj<string> = {}
  let targetDisabled = false
  if (!isEmpty(store.targets)) {
    targetOptions = {}
    each(store.targets, (target) => {
      targetOptions[`${target.name} (${target.id})`] = target.id
    })
  } else {
    targetOptions[t('targetNotConnected')] = ''
    targetDisabled = true
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
          disabled={targetDisabled}
          value={store.target ? store.target.id : ''}
          options={targetOptions}
        />
      </LunaToolbar>
    </>
  )
})
