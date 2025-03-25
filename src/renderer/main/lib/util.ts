export const toPng = async (src: string): Promise<string> => {
  const img = new Image()
  img.src = src
  await new Promise((resolve) => {
    img.onload = resolve
  })
  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No ctx')
  ctx.drawImage(img, 0, 0)
  return canvas.toDataURL('image/png')
}
