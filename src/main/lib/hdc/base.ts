import { Client } from 'hdckit'
import isStr from 'licia/isStr'
import map from 'licia/map'
import trim from 'licia/trim'
import log from 'share/common/log'
import each from 'licia/each'
import startWith from 'licia/startWith'
import singleton from 'licia/singleton'
import toNum from 'licia/toNum'
import getPort from 'licia/getPort'
import types from 'licia/types'
import { handleEvent } from 'share/main/lib/util'

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

  const connection = await target.shell(cmds.join('\necho "echo_separator"\n'))
  const output = (await connection.readAll()).toString()

  if (cmds.length === 1) {
    return trim(output)
  }

  return map(output.split('echo_separator'), (val) => trim(val))
}

const getProcesses = singleton(async (deviceId: string) => {
  const columns = ['pid', '%cpu', 'time+', 'res', 'user', 'name', 'args']
  let command = 'top -b -n 1'
  each(columns, (column) => {
    command += ` -o ${column}`
  })

  const result: string = await shell(deviceId, command)
  let lines = result.split('\n')
  let start = -1
  for (let i = 0, len = lines.length; i < len; i++) {
    if (startWith(trim(lines[i]), 'PID')) {
      start = i + 1
      break
    }
  }

  lines = lines.slice(start)
  const processes: any[] = []
  each(lines, (line) => {
    line = trim(line)
    if (!line) {
      return
    }
    const parts = line.split(/\s+/)
    const process: any = {}
    each(columns, (column, index) => {
      if (column === 'args') {
        process[column] = parts.slice(index).join(' ')
      } else {
        process[column] = parts[index] || ''
      }
    })
    if (process.args === command) {
      return
    }
    processes.push(process)
  })

  return processes
})

export async function forwardTcp(connectKey: string, remote: string) {
  const target = await client.getTarget(connectKey)
  const forwards = await target.listForwards()

  for (let i = 0, len = forwards.length; i < len; i++) {
    const forward = forwards[i]
    if (forward.remote === remote) {
      return toNum(forward.local.replace('tcp:', ''))
    }
  }

  const port = await getPort()
  const local = `tcp:${port}`
  await target.forward(local, remote)

  return port
}

export async function init(c: Client) {
  client = c

  handleEvent('getProcesses', getProcesses)
}

const targetStore: types.PlainObj<any> = {}

export function getTargetStore(connectKey: string, key: string) {
  return targetStore[connectKey] && targetStore[connectKey][key]
}

export function setTargetStore(connectKey: string, key: string, value: any) {
  if (!targetStore[connectKey]) {
    targetStore[connectKey] = {}
  }
  targetStore[connectKey][key] = value
}
