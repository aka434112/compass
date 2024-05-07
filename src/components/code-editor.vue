<template>
  <Codemirror
    ref="codeEditor"
    :value="modelValue"
    :options="computedCmOptions"
    border
    :height="200"
    class="compass__editor-container"
    @update:value="$emit('update:model-value', $event)"
    v-bind="$props"
  />
</template>

<script lang="ts">
  import { defineComponent, PropType, ref, computed } from 'vue'

  import Codemirror from 'codemirror-editor-vue3'
  // placeholder
  import 'codemirror/addon/display/placeholder'
  // show hints
  import 'codemirror/addon/hint/show-hint'
  // theme
  import 'codemirror/theme/mdn-like.css'
  import 'codemirror/addon/hint/show-hint.css'

  // @ts-ignore
  import type { EditorConfiguration } from 'codemirror'

  export default defineComponent({
    components: {
      Codemirror,
    },
    props: {
      codeEditorOptions: {
        type: Object as PropType<EditorConfiguration>,
        default: () => ({}),
      },
      modelValue: {
        type: String,
        default: '',
      },
    },
    emits: ['update:model-value'],
    setup(props) {
      const codeEditor = ref(null)
      const computedCmOptions = computed(() => ({
        ...props.codeEditorOptions,
        lineNumbers: true,
        theme: 'mdn-like',
        indentUnit: 4,
      }))
      return {
        // Used by the parent to be able to reference the codemirror editor.
        // Do not remove from here
        codeEditor,
        computedCmOptions,
      }
    },
  })
</script>

<style lang="scss" scoped>
  :deep(.CodeMirror *) {
    @apply font-montserrat #{!important};
    .CodeMirror-line,
    .CodeMirror-linenumber {
      @apply text-base;
    }
    .CodeMirror-linenumber {
      @apply pl-0 left-0 #{!important};
    }
    .CodeMirror-gutters {
      @apply border-l-primary;
    }
  }
  :deep(.CodeMirror-vscrollbar) {
    @apply scrollbar;
  }
  :deep(.compass__code-editor__highlighted-text) {
    @apply bg-primary-background;
  }
  :deep(.cm-comment) {
    @apply text-xs;
  }
</style>
