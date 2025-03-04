import { IpcGetTargets } from '../../common/types'
import { handleEvent } from 'share/main/lib/util'

const getTargets: IpcGetTargets = async function () {
  return []
}

export async function init() {
  handleEvent('getTargets', getTargets)
}
