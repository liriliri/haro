import BaseStore from 'share/renderer/store/BaseStore'
import { ITarget } from '../../common/types'
import { makeObservable, observable, runInAction } from 'mobx'
import ScreencastClient from './lib/ScreencastClient'

class Store extends BaseStore {
  target!: ITarget
  screencastClient!: ScreencastClient
  alwaysOnTop = false
  constructor() {
    super()

    makeObservable(this, {
      alwaysOnTop: observable,
      target: observable,
    })

    this.init()
    this.bindEvent()
  }
  setAlwaysOnTop(val: boolean) {
    this.alwaysOnTop = val
    main.setScreencastStore('alwaysOnTop', val)
    main.setScreencastAlwaysOnTop(val)
  }
  async setTarget(target: ITarget | null) {
    if (target === null) {
      main.closeScreencast()
    } else {
      this.screencastClient = new ScreencastClient(target.key)
      runInAction(() => (this.target = target))
    }
  }
  private async init() {
    const target = await main.getMainStore('target')
    this.setTarget(target)
    const alwaysOnTop = await main.getScreencastStore('alwaysOnTop')
    if (alwaysOnTop) {
      main.setScreencastAlwaysOnTop(true)
      runInAction(() => (this.alwaysOnTop = true))
    }
  }
  private bindEvent() {
    main.on('changeMainStore', (name: string, val: any) => {
      if (name === 'target') {
        this.setTarget(val)
      }
    })
  }
}

export default new Store()
