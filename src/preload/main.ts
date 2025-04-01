import {
  IpcCleanBundleCache,
  IpcCleanBundleData,
  IpcGetBundleInfos,
  IpcGetBundles,
  IpcGetOverview,
  IpcGetTargets,
  IpcInputKey,
  IpcInstallBundle,
  IpcScreencap,
  IpcStartBundle,
  IpcStopBundle,
  IpcUninstallBundle,
} from 'common/types'
import { IpcGetStore, IpcSetStore } from 'share/common/types'
import mainObj from 'share/preload/main'
import { invoke } from 'share/preload/util'

export default Object.assign(mainObj, {
  getMainStore: invoke<IpcGetStore>('getMainStore'),
  setMainStore: invoke<IpcSetStore>('setMainStore'),
  getTargets: invoke<IpcGetTargets>('getTargets'),
  getOverview: invoke<IpcGetOverview>('getOverview'),
  getSettingsStore: invoke<IpcGetStore>('getSettingsStore'),
  setSettingsStore: invoke<IpcSetStore>('setSettingsStore'),
  inputKey: invoke<IpcInputKey>('inputKey'),
  screencap: invoke<IpcScreencap>('screencap'),
  getBundles: invoke<IpcGetBundles>('getBundles'),
  getBundleInfos: invoke<IpcGetBundleInfos>('getBundleInfos'),
  installBundle: invoke<IpcInstallBundle>('installBundle'),
  startBundle: invoke<IpcStartBundle>('startBundle'),
  stopBundle: invoke<IpcStopBundle>('stopBundle'),
  cleanBundleData: invoke<IpcCleanBundleData>('cleanBundleData'),
  cleanBundleCache: invoke<IpcCleanBundleCache>('cleanBundleCache'),
  uninstallBundle: invoke<IpcUninstallBundle>('uninstallBundle'),
})
