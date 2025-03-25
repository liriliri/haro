import { IpcGetOverview, IpcGetTargets, IpcInputKey } from 'common/types'
import { IpcGetStore, IpcSetStore } from 'share/common/types'
import mainObj from 'share/preload/main'
import { invoke } from 'share/preload/util'

export default Object.assign(mainObj, {
  getMainStore: invoke<IpcGetStore>('getMainStore'),
  setMainStore: invoke<IpcSetStore>('setMainStore'),
  getTargets: invoke<IpcGetTargets>('getTargets'),
  getOverview: invoke<IpcGetOverview>('getOverview'),
  inputKey: invoke<IpcInputKey>('inputKey'),
})
