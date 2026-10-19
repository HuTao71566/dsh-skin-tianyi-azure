// Local smoke test: materialize the client bundle with stub globals and run
// apply() against a stub context, so bundle errors surface without a browser.
import { readFileSync } from 'node:fs'

const file = 'C:/Users/001/.dsh-plugins/dsh-skin-tianyi/client.js'
const source = readFileSync(file, 'utf8')

const appends = []
const bodyAttrs = new Map()
const rootVars = new Map()
const dispatched = []
const listeners = new Map()

const makeElement = () => ({
  className: '',
  attrs: new Map(),
  children: [],
  textContent: '',
  parentNode: null,
  setAttribute(name, value) { this.attrs.set(name, value) },
  removeAttribute(name) { this.attrs.delete(name) },
  appendChild(child) { this.children.push(child); child.parentNode = this; return child },
  remove() { this.removed = true; this.parentNode = null },
})

globalThis.CustomEvent = class CustomEvent {
  constructor(type, init) { this.type = type; this.detail = init?.detail }
}

globalThis.document = {
  documentElement: {
    getAttribute: (name) => (name === 'lang' ? 'zh-CN' : null),
    style: {
      setProperty: (name, value) => rootVars.set(name, value),
      removeProperty: (name) => rootVars.delete(name),
    },
  },
  body: {
    setAttribute(name, value) { bodyAttrs.set(name, value) },
    removeAttribute(name) { bodyAttrs.delete(name) },
    getAttribute(name) { return bodyAttrs.has(name) ? bodyAttrs.get(name) : null },
    hasAttribute(name) { return bodyAttrs.has(name) },
  },
  createElement: () => makeElement(),
  head: {
    appendChild(el) { appends.push(el); el.parentNode = this },
    removeChild(el) { el.parentNode = null },
  },
}

let def
globalThis.window = {
  __ModuleLoader__: { load(value) { def = value } },
  addEventListener(type, fn) { listeners.set(type, fn) },
  removeEventListener(type) { listeners.delete(type) },
  dispatchEvent(event) {
    dispatched.push(event)
    const readyHandler = listeners.get(event.type)
    if (readyHandler && event.type.endsWith('ready-v2')) readyHandler(event)
    return true
  },
}

new Function(source)()

console.log('registered id:', def?.id)
const React = { createElement: (...args) => ({ type: args[0], props: args[1] }) }
const plugin = def.factory((name) => {
  if (name === 'react') return React
  throw new Error('unexpected require: ' + name)
})
console.log('plugin keys:', Object.keys(plugin), 'inject:', plugin.inject)

const registrations = []
const effects = []
const disposers = []
const ctx = {
  effect(fn, label) {
    effects.push(label)
    const dispose = fn()
    if (typeof dispose === 'function') disposers.push(dispose)
    return dispose
  },
  theme: {
    getTheme() {
      return { active: { id: 'dark', colorScheme: 'dark' } }
    },
    overrideTokens(source, tokens) {
      console.log('overrideTokens:', source, Object.keys(tokens).join(','))
      return () => {}
    },
  },
  on(event) {
    console.log('on:', event)
    return () => {}
  },
  slots: {
    inject(key, cb) { return cb() },
    register(options, component) {
      registrations.push({ options, kind: typeof component })
      return () => {}
    },
  },
}

plugin.apply(ctx)
console.log('effects:', effects)
console.log('registrations:', registrations.map((r) => r.options?.name + '#' + (r.options?.id ?? '')))
console.log('body attrs while active:', [...bodyAttrs.keys()])

const announced = dispatched.filter((event) => event.type === 'dsh:skin-customization-register-v2')
const definition = announced.at(-1)?.detail?.definition
console.log('customization definition:', definition?.skinId, '|', definition?.settings?.map((s) => s.key + ':' + s.min + '-' + s.max + '@' + s.defaultValue).join(', '))

// simulate the manager applying a value, then unloading the skin
definition?.apply({ values: { artOpacity: 45, darkOpacity: 18, sideScaleLight: 120, sideScaleDark: 80 }, visibility: {} })
console.log('root vars while applied:', [...rootVars.entries()])

for (const dispose of disposers) dispose()
console.log('body attrs after unload:', [...bodyAttrs.keys()])
console.log('root vars after unload:', [...rootVars.keys()])
console.log('style elements detached:', appends.every((el) => el.parentNode === null))
console.log('unregister dispatched:', dispatched.some((event) => event.type === 'dsh:skin-customization-unregister-v2'))
