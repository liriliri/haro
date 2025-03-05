import { IpcGetOverview, IpcGetTargets } from '../../common/types'
import { handleEvent } from 'share/main/lib/util'
import Hdc, { Client } from 'hdckit'
import log from 'share/common/log'
import map from 'licia/map'

const logger = log('hdc')

let client: Client

const getTargets: IpcGetTargets = async function () {
  const targets = await client.listTargets()

  return Promise.all(
    map(targets, async (connectKey: string) => {
      const parameters = await client.getTarget(connectKey).getParameters()

      return {
        name: parameters['const.product.name'],
        key: connectKey,
      }
    })
  ).catch(() => [])
}

const getOverview: IpcGetOverview = async function (connectKey) {
  const target = client.getTarget(connectKey)

  const parameters = await target.getParameters()

  return {
    name: parameters['const.product.name'],
    brand: parameters['const.product.brand'],
    model: parameters['const.product.model'],
  }
}

export async function init() {
  logger.info('init')

  client = Hdc.createClient()

  handleEvent('getTargets', getTargets)
  handleEvent('getOverview', getOverview)
}
