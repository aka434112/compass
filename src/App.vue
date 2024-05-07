<template>
  <component
    :is="routeLayout"
    :route-title="routeTitle"
    class="compass__layout"
  />
</template>

<script lang="ts">
  import { useI18n } from 'vue-i18n'
  import { useRoute } from 'vue-router'
  import { defineComponent, ref, watch } from 'vue'

  import { isFunction } from 'lodash-es'
  import { ROUTE_LAYOUTS } from './const/route-layouts'

  export default defineComponent({
    setup() {
      const { t } = useI18n()
      const routeLayout = ref()
      const route = useRoute()
      const routeTitle = ref('')
      watch(
        route,
        async () => {
          const routeMeta = route.meta || {}
          const routeMetaTitle = routeMeta.title
          const _routeTitle: string = isFunction(routeMetaTitle)
            ? routeMetaTitle(t)
            : routeMetaTitle || ''
          document.title = `${t('title')} - ${_routeTitle}`
          routeTitle.value = _routeTitle
          const routeLayoutName = (routeMeta.layout ||
            ROUTE_LAYOUTS.DEFAULT) as string
          const routeLayoutFile = await import(
            `./layouts/${routeLayoutName}.vue`
          )
          routeLayout.value = routeLayoutFile.default
        },
        {
          immediate: true,
        }
      )

      return {
        routeTitle,
        routeLayout,
      }
    },
  })
</script>

<style lang="scss">
  @import '../public/styles/index.css';
</style>

<style lang="scss" scoped>
  .compass__layout {
    @apply w-full h-full;
  }
</style>
