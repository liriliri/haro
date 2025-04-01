import { makeObservable, observable, runInAction } from 'mobx'
import extend from 'licia/extend'

export class Process {
  onlyBundle = false
  constructor() {
    makeObservable(this, {
      onlyBundle: observable,
    })

    this.init()
  }
  async init() {
    const process = await main.getMainStore('process')
    if (process) {
      extend(this, process)
    }
  }
  async set(key: string, val: any) {
    runInAction(() => {
      this[key] = val
    })
    await main.setMainStore('process', {
      onlyBundle: this.onlyBundle,
    })
  }
}
