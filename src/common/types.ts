export interface ITarget {
  key: string
  name: string
  ohosVersion: string
  sdkVersion: string
}

export interface IBundleInfo {
  bundleName: string
  versionName: string
  icon: string
  label: string
  system: boolean
  apiTargetVersion: number
  vendor: string
  installTime: number
  releaseType: string
  mainAbility?: string
}

export type IpcGetTargets = () => Promise<ITarget[]>
export type IpcGetOverview = (connectKey: string) => Promise<{
  name: string
  brand: string
  model: string
  serialNum: string
  kernelVersion: string
  processor: string
  abi: string
  physicalResolution: string
}>
export type IpcInputKey = (connectKey: string, keyCode: number) => Promise<void>
export type IpcScreencap = (connectKey: string) => Promise<string>
export type IpcGetBundles = (
  connectKey: string,
  system?: boolean
) => Promise<string[]>
export type IpcInstallBundle = (
  connectKey: string,
  hap: string
) => Promise<void>
export type IpcGetBundleInfos = (
  connectKey: string,
  bundleNames: string[]
) => Promise<IBundleInfo[]>
export type IpcStartBundle = (
  connectKey: string,
  bundleName: string,
  ability: string
) => Promise<void>
export type IpcStopBundle = (
  connectKey: string,
  bundleName: string
) => Promise<void>
export type IpcCleanBundleData = IpcStopBundle
export type IpcCleanBundleCache = IpcStopBundle
export type IpcUninstallBundle = IpcStopBundle
