import { App, Plugin } from 'vue'

const plugins: [Plugin, any][] = []
const _plugins = import.meta.glob('./*.ts', {
  eager: true,
})
for (let plugin in _plugins) {
  plugins.push((_plugins[plugin] as any).default)
}

export const registerGlobalPlugin = (app: App) => {
  for (const plugin of plugins) {
    let _plugin: Plugin | null | undefined = null
    let _pluginOpts: Record<string, any> = {}
    const [p, options] = plugin
    _plugin = p
    _pluginOpts = options || {}

    app.use(_plugin, _pluginOpts)
  }
}

export * from './i18n'
export * from './router'
