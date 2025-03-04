import I18n from 'licia/I18n'
import types from 'licia/types'
import zhCN from './langs/zh-CN.json'

const langs = {
  'zh-CN': zhCN,
  'en-US': zhCN,
}

export const i18n = new I18n('zh-CN', langs)

export function hasLocale(locale: string) {
  return !!langs[locale]
}

export function t(path: string | string[], data?: types.PlainObj<any>) {
  return i18n.t(path, data)
}
