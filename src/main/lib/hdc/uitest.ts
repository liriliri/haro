import { Client } from 'hdckit'
import each from 'licia/each'
import { IpcDumpWindowHierarchy } from '../../../common/types'
import { getTargetStore, setTargetStore } from './base'
import { handleEvent, resolveUnpack } from 'share/main/lib/util'

let client: Client

async function getUiDriver(connectKey: string) {
  let uiDriver = getTargetStore(connectKey, 'uiDriver')
  if (!uiDriver) {
    const target = await client.getTarget(connectKey)
    uiDriver = await target.createUiDriver(
      resolveUnpack('uitestkit_sdk/uitest_agent_v1.1.0'),
      '1.1.0'
    )
    setTargetStore(connectKey, 'uiDriver', uiDriver)
  }
  return uiDriver
}

const dumpWindowHierarchy: IpcDumpWindowHierarchy = async function (
  connectKey
) {
  const uiDriver = await getUiDriver(connectKey)
  const layout = await uiDriver.captureLayout()
  return toHierarchyXml(layout)
}

function toHierarchyXml(json: any) {
  const { attributes, children } = json
  let xml = ''

  const tagName = attributes.type
  delete attributes.type
  xml += `<${tagName || 'Layout'}`
  each(attributes, (val, key) => {
    xml += ` ${key}="${val}"`
  })
  xml += '>'

  each(children, (child) => {
    xml += toHierarchyXml(child)
  })

  return xml + `</${tagName || 'Layout'}>`
}

export function init(c: Client) {
  client = c

  handleEvent('dumpWindowHierarchy', dumpWindowHierarchy)
}
