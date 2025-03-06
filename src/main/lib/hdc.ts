import { IpcGetOverview, IpcGetTargets } from '../../common/types'
import { handleEvent } from 'share/main/lib/util'
import Hdc, { Client } from 'hdckit'
import log from 'share/common/log'
import map from 'licia/map'
import startWith from 'licia/startWith'
import trim from 'licia/trim'
import { shell } from './hdc/base'
import * as base from './hdc/base'

const logger = log('hdc')

let client: Client

const getTargets: IpcGetTargets = async function () {
  const targets = await client.listTargets()

  return Promise.all(
    map(targets, async (connectKey: string) => {
      const parameters = await client.getTarget(connectKey).getParameters()
      let ohosVersion =
        parameters['const.product.software.version'].split(/\s/)[1]
      ohosVersion = ohosVersion.slice(0, ohosVersion.indexOf('('))

      const sdkVersion = parameters['const.ohos.apiversion']

      return {
        name: parameters['const.product.name'],
        key: connectKey,
        ohosVersion,
        sdkVersion,
      }
    })
  ).catch(() => [])
}

const getOverview: IpcGetOverview = async function (connectKey) {
  const target = client.getTarget(connectKey)

  const parameters = await target.getParameters()
  const [deviceInfo, kernelVersion] = await shell(connectKey, [
    'SP_daemon -deviceinfo',
    'uname -a',
  ])

  return {
    name: parameters['const.product.name'],
    brand: parameters['const.product.brand'],
    model: parameters['const.product.model'],
    serialNum: getPropValue('sn', deviceInfo),
    kernelVersion: kernelVersion.slice(0, kernelVersion.indexOf('#')),
  }
}

function getPropValue(key: string, str: string) {
  const lines = str.split('\n')
  for (let i = 0, len = lines.length; i < len; i++) {
    const line = trim(lines[i])
    if (startWith(line, key)) {
      return trim(line.replace(/.*:/, ''))
    }
  }

  return ''
}

export async function init() {
  logger.info('init')

  client = Hdc.createClient()

  base.init(client)

  handleEvent('getTargets', getTargets)
  handleEvent('getOverview', getOverview)
}
