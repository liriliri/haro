export interface ITarget {
  key: string
  name: string
  ohosVersion: string
  sdkVersion: string
}

export type IpcGetTargets = () => Promise<ITarget[]>
export type IpcGetOverview = (connectKey: string) => Promise<{
  name: string
  brand: string
  model: string
  serialNum: string
  kernelVersion: string
}>
