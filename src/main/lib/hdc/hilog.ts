import Emitter from 'licia/Emitter'
import types from 'licia/types'
import { Client } from 'hdckit'
import { getTargetStore, getPidNames, setTargetStore } from './base'
import uniqId from 'licia/uniqId'
import * as window from 'share/main/lib/window'
import { handleEvent } from 'share/main/lib/util'
import { IpcOpenHilog } from 'common/types'

let client: Client

class Hilog extends Emitter {
  private reader: any
  private paused = false
  constructor(reader: any) {
    super()

    this.reader = reader
  }
  async init(connectKey: string) {
    const { reader } = this

    reader.on('entry', async (entry) => {
      if (this.paused) {
        return
      }
      entry.bundleName = `pid-${entry.pid}`
      if (entry.pid != 0) {
        let pidNames = getTargetStore(connectKey, 'pidNames')
        if (!pidNames || !pidNames[entry.pid]) {
          pidNames = await getPidNames(connectKey)
          setTargetStore(connectKey, 'pidNames', pidNames)
        }
        entry.bundleName = pidNames[entry.pid] || `pid-${entry.pid}`
      }
      this.emit('entry', entry)
    })
  }
  close() {
    this.reader.end()
  }
  pause() {
    this.paused = true
  }
  resume() {
    this.paused = false
  }
}

const hilogs: types.PlainObj<Hilog> = {}

const openHilog: IpcOpenHilog = async function (connectKey) {
  const device = await client.getTarget(connectKey)
  const reader = await device.openHilog({ clear: true })
  const hilog = new Hilog(reader)
  await hilog.init(connectKey)
  const hilogId = uniqId('hilog')
  hilog.on('entry', (entry) => {
    window.sendTo('main', 'hilogEntry', hilogId, entry)
  })
  hilogs[hilogId] = hilog

  return hilogId
}

const pauseHilog = async function (hilogId: string) {
  hilogs[hilogId].pause()
}

const resumeHilog = async function (hilogId: string) {
  hilogs[hilogId].resume()
}

const closeHilog = async function (hilogId: string) {
  hilogs[hilogId].close()
  delete hilogs[hilogId]
}

export function init(c: Client) {
  client = c

  handleEvent('openHilog', openHilog)
  handleEvent('closeHilog', closeHilog)
  handleEvent('pauseHilog', pauseHilog)
  handleEvent('resumeHilog', resumeHilog)
}
