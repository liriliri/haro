import LunaModal from 'luna-modal/react'
import LunaSetting, {
  LunaSettingSelect,
  LunaSettingTitle,
} from 'luna-setting/react'
import { t } from '../../../../common/util'
import Style from './Settings.module.scss'
import { createPortal } from 'react-dom'
import { observer } from 'mobx-react-lite'
import store from '../../store'
import { IModalProps } from 'share/common/types'

export default observer(function SettingsModal(props: IModalProps) {
  function onChange(key, val) {
    store.settings.set(key, val)
  }

  return createPortal(
    <LunaModal
      title={t('settings')}
      width={400}
      visible={props.visible}
      onClose={props.onClose}
    >
      <LunaSetting className={Style.settings} onChange={onChange}>
        <LunaSettingTitle title={t('appearance')} />
        <LunaSettingSelect
          keyName="theme"
          value={store.settings.theme}
          title={t('theme')}
          options={{
            [t('sysPreference')]: 'system',
            [t('light')]: 'light',
            [t('dark')]: 'dark',
          }}
        />
      </LunaSetting>
    </LunaModal>,
    document.body
  )
})
