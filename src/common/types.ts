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

export interface IProcess {
  name: string
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
export type IpcGetProcesses = (connectKey: string) => Promise<IProcess[]>
export type IpcCreateShell = (connectKey: string) => Promise<string>
export type IpcWriteShell = (sessionId: string, data: string) => Promise<void>
export type IpcKillShell = (sessionId: string) => void
export type IpcDumpWindowHierarchy = (connectKey: string) => Promise<string>
export type IpcListForwards = (connectKey: string) => Promise<
  {
    local: string
    remote: string
  }[]
>
export type IpcListReverses = IpcListForwards
export type IpcForward = (
  connectKey: string,
  local: string,
  remote: string
) => void
export type IpcReverse = (
  connectKey: string,
  remote: string,
  local: string
) => void
export type IpcRemoveForward = IpcForward
export type IpcRemoveReverse = IpcReverse
export type IpcGetTopBundle = (connectKey: string) => Promise<{
  name: string
  pid: number
}>
export type IpcGetWebviews = (connectKey: string, pid: number) => Promise<any[]>
export type IpcSetScreencastAlwaysOnTop = (alwaysOnTop: boolean) => void
export type IpcStartCaptureScreen = (connectKey: string, scale: number) => void
export type IpcStopCaptureScreen = (connectKey: string) => void
export type IpcTouchDown = (connectKey: string, x: number, y: number) => void
export type IpcTouchMove = IpcTouchDown
export type IpcTouchUp = IpcTouchDown
