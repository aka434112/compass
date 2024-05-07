<template>
  <div class="compass__layout--default">
    <nav-menu>
      <div :class="['compass__layout--default__view-container']">
        <div
          v-if="isLoading"
          class="compass__layout--default__view-container--loading"
        >
          <loading class="compass__layout--default__loading" />
        </div>
        <router-view class="compass__layout--default__view" />
      </div>
    </nav-menu>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  import { Loading } from '@element-plus/icons-vue'

  import { useSetLoading } from '@/composables/set-loading'
  import { useLayoutProps } from '@/composables/layout-props'
  import { PROP_NAMES, PROP_DEFINITIONS } from '@/const/layout-props'

  export default defineComponent({
    components: {
      Loading,
    },
    props: {
      ...PROP_DEFINITIONS,
    },
    setup(props) {
      const layoutProps = useLayoutProps(props)
      const { isLoading } = useSetLoading()
      return {
        isLoading,
        PROP_NAMES,
        layoutProps,
      }
    },
  })
</script>

<style lang="scss" scoped>
  .compass__layout--default {
    @apply h-full;
    &__view-container {
      @apply p-8 flex flex-col h-full;
      &--loading {
        @apply absolute bg-[rgba(0,0,0,0.2)] h-full w-full z-[var(--compass-overlay-z-index)] top-0 left-0;
      }
    }
    &__loading {
      @apply absolute z-[calc(var(--compass-overlay-z-index)+1)] top-1/2 left-1/2 h-10 w-10 animate-spin text-primary;
    }
    &__view {
      @apply flex-grow h-full;
    }
    &__route-title {
      @apply font-semibold text-xl;
    }
  }
</style>
