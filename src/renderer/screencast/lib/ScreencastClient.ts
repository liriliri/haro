import types from 'licia/types'
import noop from 'licia/noop'
import Readiness from 'licia/Readiness'
import { loadImage } from './util'

export default class ScreencastClient {
  canvas = document.createElement('canvas')
  ctx = this.canvas.getContext('2d')!
  ready: Promise<void>
  private connectKey: string
  private offCaptureScreen: types.AnyFn = noop
  private readiness = new Readiness()
  constructor(connectKey: string) {
    this.connectKey = connectKey
    this.ready = this.readiness.ready('captureScreen')

    this.start()
    this.bindEvent()
  }
  async start() {
    const { connectKey } = this
    await main.stopCaptureScreen(connectKey)
    await main.startCaptureScreen(connectKey)
  }
  destroy() {
    main.stopCaptureScreen(this.connectKey)
    this.offCaptureScreen()
  }
  private async draw(image: Uint8Array) {
    const { canvas, ctx } = this
    const blob = new Blob([image], { type: 'image/jpeg' })
    const url = URL.createObjectURL(blob)
    const img = await loadImage(url)
    URL.revokeObjectURL(url)
    const width = img.naturalWidth
    const height = img.naturalHeight
    if (canvas.width !== width) {
      canvas.width = width
    }
    if (canvas.height !== height) {
      canvas.height = height
    }
    ctx.drawImage(img, 0, 0)
  }
  private bindEvent() {
    this.offCaptureScreen = main.on('captureScreen', (connectKey, image) => {
      if (connectKey === this.connectKey) {
        this.readiness.signal('captureScreen')
        this.draw(image)
      }
    })
  }
}
