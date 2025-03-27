import { IpcGetBundles, IpcInstallBundle } from 'common/types'
import { Client } from 'hdckit'
import { handleEvent } from 'share/main/lib/util'
import { shell } from './base'
import map from 'licia/map'
import trim from 'licia/trim'

let client: Client

const getBundles: IpcGetBundles = async (connectKey) => {
  const result = await shell(connectKey, 'bm dump -a')

  return map(trim(result).split('\n').slice(1), (line) => trim(line))
}

const installBundle: IpcInstallBundle = async (connectKey, hap) => {
  const target = await client.getTarget(connectKey)
  await target.install(hap)
}

export async function init(c: Client) {
  client = c

  handleEvent('getBundles', getBundles)
  handleEvent('installBundle', installBundle)
}
