import isWindows from 'licia/isWindows.js'

const pkg = await fs.readJson('package.json')
const electron = pkg.devDependencies.electron
delete pkg.devDependencies
pkg.devDependencies = {
  electron,
}
delete pkg.scripts
pkg.scripts = {
  start: 'electron main/index.js',
}
pkg.main = 'main/index.js'

await $`npm run build:main`
await $`npm run build:preload`
await $`npm run build:renderer`

await fs.copy('build', 'dist/build')
if (isWindows) {
  await fs.copy('hdc/win', 'dist/hdc')
} else {
  if (process.arch === 'arm64') {
    await fs.copy('hdc/mac/arm64', 'dist/hdc')
  } else {
    await fs.copy('hdc/mac/x64', 'dist/hdc')
  }
}
await fs.copy('uitestkit_sdk', 'dist/uitestkit_sdk')
cd('dist')

await fs.writeJson('package.json', pkg, {
  spaces: 2,
})

await $`npm i --production`
