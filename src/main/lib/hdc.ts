import { IpcGetTargets } from '../../common/types'
import { handleEvent } from 'share/main/lib/util'
import Hdc, { Client } from 'hdckit'
import log from 'share/common/log'
import map from 'licia/map'

const logger = log('hdc')

let client: Client

const getTargets: IpcGetTargets = async function () {
  const targets = await client.listTargets()

  return Promise.all(
    map(targets, async (target: string) => {
      const parameters = await client.getTarget(target).getParameters()

      return {
        name: parameters['const.product.name'],
        id: target,
      }
    })
  ).catch(() => [])
}

export async function init() {
  logger.info('init')

  client = Hdc.createClient()

  handleEvent('getTargets', getTargets)
}
