export interface ITarget {
  id: string
  name: string
}

export type IpcGetTargets = () => Promise<ITarget[]>
