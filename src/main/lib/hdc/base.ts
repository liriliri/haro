import { Client } from 'hdckit'
import isStr from 'licia/isStr'
import map from 'licia/map'
import trim from 'licia/trim'
import log from 'share/common/log'

const logger = log('hdcBase')

let client: Client

export async function shell(connectKey: string, cmd: string): Promise<string>
export async function shell(
  connectKey: string,
  cmd: string[]
): Promise<string[]>
export async function shell(
  connectKey: string,
  cmd: string | string[]
): Promise<string | string[]> {
  logger.debug('shell', cmd)

  const target = await client.getTarget(connectKey)
  const cmds: string[] = isStr(cmd) ? [cmd] : cmd

  const connection = await target.shell(cmds.join('\necho "haro_separator"\n'))
  const output = (await connection.readAll()).toString()

  if (cmds.length === 1) {
    return trim(output)
  }

  return map(output.split('haro_separator'), (val) => trim(val))
}

export async function init(c: Client) {
  client = c
}
