export interface ITarget {
  key: string
  name: string
}

export type IpcGetTargets = () => Promise<ITarget[]>
export type IpcGetOverview = (
  connectKey: string
) => Promise<{ name: string; brand: string; model: string }>
