// Inline the artwork into the hand-written Client bundle.
//   node build.mjs
// Reads src/client.template.js plus assets/*.webp and writes ./client.js.
import { readFileSync, writeFileSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const dataUri = (file) =>
  'data:image/webp;base64,' + readFileSync(join(here, 'assets', file)).toString('base64')

const replacements = {
  __WALLPAPER_DARK__: dataUri('wallpaper-dark.webp'),
  __WALLPAPER_LIGHT__: dataUri('wallpaper-light.webp'),
  __AVATAR__: dataUri('avatar.webp'),
  __AMBIENCE__: dataUri('sidebar-ambience.webp'),
  __AMBIENCE_LIGHT__: dataUri('sidebar-ambience-light.webp'),
  __PORTRAIT_DARK__: dataUri('sidebar-portrait-dark.webp'),
}

let out = readFileSync(join(here, 'src', 'client.template.js'), 'utf8')
for (const [token, value] of Object.entries(replacements)) {
  if (!out.includes(token)) throw new Error(`template is missing ${token}`)
  out = out.split(token).join(value)
}

const target = join(here, 'client.js')
writeFileSync(target, out, 'utf8')
const kb = (statSync(target).size / 1024).toFixed(1)
console.log(`client.js written (${kb} KiB)`)
