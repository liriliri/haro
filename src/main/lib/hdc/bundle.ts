import {
  IBundleInfo,
  IpcGetBundleInfos,
  IpcGetBundles,
  IpcInstallBundle,
} from 'common/types'
import { Client } from 'hdckit'
import { handleEvent } from 'share/main/lib/util'
import { shell } from './base'
import trim from 'licia/trim'
import axios from 'axios'
import types from 'licia/types'
import log from 'share/common/log'
import map from 'licia/map'
import startWith from 'licia/startWith'

const logger = log('hdcBundle')

let client: Client

const getBundles: IpcGetBundles = async (connectKey) => {
  const result = await shell(connectKey, 'bm dump -a')

  return map(trim(result).split('\n').slice(1), (line) => trim(line))
}

const getBundleInfos: IpcGetBundleInfos = async (connectKey, bundleNames) => {
  const result: IBundleInfo[] = []

  const dumpInfos = await shell(
    connectKey,
    map(bundleNames, (name) => `bm dump -n ${name}`)
  )
  const infos = map(dumpInfos, (dump) => {
    const lines = dump.split('\n')
    return JSON.parse(lines.slice(1).join('\n'))
  })

  for (let i = 0, len = bundleNames.length; i < len; i++) {
    const bundleName = bundleNames[i]
    const bundleInfo: IBundleInfo = {
      bundleName,
      label: bundleName,
      icon: '',
      system: false,
      versionName: '',
      apiTargetVersion: 0,
      vendor: '',
      installTime: 0,
      releaseType: '',
    }

    const info = infos[i]
    const applicationInfo = info.applicationInfo
    bundleInfo.system = applicationInfo.isSystemApp
    bundleInfo.versionName = applicationInfo.versionName
    bundleInfo.apiTargetVersion = applicationInfo.apiTargetVersion
    bundleInfo.vendor = applicationInfo.vendor
    bundleInfo.installTime = info.installTime
    bundleInfo.releaseType = info.releaseType

    if (!bundleInfo.system && !startWith(bundleName, 'com.huawei')) {
      try {
        const onlineInfo = await getOnlineBundleInfo(bundleName)
        if (onlineInfo.name) {
          bundleInfo.label = onlineInfo.name
        }
        if (onlineInfo.icon) {
          bundleInfo.icon = onlineInfo.icon
        }
      } catch (e) {
        logger.error(e)
      }
    }
    result.push(bundleInfo)
  }

  return result
}

const INFO_URL = 'https://web-drcn.hispace.dbankcloud.com/edge/webedge/appinfo'
const onlineInfos: types.PlainObj<any> = {}
async function getOnlineBundleInfo(bundleName: string) {
  if (onlineInfos[bundleName]) {
    return onlineInfos[bundleName]
  }

  logger.info('get online bundle info', bundleName)
  const { data } = await axios.post(INFO_URL, {
    pkgName: bundleName,
    appId: bundleName,
    locale: 'zh_CN',
    countryCode: 'CN',
    orderApp: 1,
  })
  onlineInfos[bundleName] = data

  return data
}

const installBundle: IpcInstallBundle = async (connectKey, hap) => {
  const target = await client.getTarget(connectKey)
  await target.install(hap)
}

export async function init(c: Client) {
  client = c

  handleEvent('getBundles', getBundles)
  handleEvent('installBundle', installBundle)
  handleEvent('getBundleInfos', getBundleInfos)
}
