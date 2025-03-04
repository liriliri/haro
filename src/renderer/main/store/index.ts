import { makeObservable, observable } from 'mobx'
import { setMainStore } from '../../lib/util'
import BaseStore from 'share/renderer/store/BaseStore'
import isStr from 'licia/isStr'
import find from 'licia/find'
import { ITarget } from '../../../common/types'

class Store extends BaseStore {
  targets: ITarget[] = []
  target: ITarget | null = null
  panel = 'overview'
  constructor() {
    super()

    makeObservable(this, {
      targets: observable,
      target: observable,
      panel: observable,
    })
  }
  selectTarget = (target: string | ITarget | null) => {
    if (isStr(target)) {
      const d = find(this.targets, ({ id }) => id === target)
      if (d) {
        this.target = d
      }
    } else {
      this.target = target
    }

    setMainStore('target', this.target)
  }
  selectPanel(panel: string) {
    this.panel = panel
    setMainStore('panel', panel)
  }
}

export default new Store()
