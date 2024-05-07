<template>
  <div class="compass__sql-editor">
    <code-editor
      v-bind="$props"
      ref="sqlEditor"
      :model-value="modelValue"
      :code-editor-options="computedCmOptions"
      @update:model-value="
        $emit(
          'update:model-value',
          $event?.replace(CODE_EDITOR_SUPPORTED_QUERIES_COMMENT, '')
        )
      "
    />
    <div v-if="isInvalidQuery" class="compass__sql-editor__error">
      <el-alert :title="validationErrorTitle" type="error">
        <div v-html="validationErrorMessages"></div>
      </el-alert>
    </div>
    <slot
      name="after-editor"
      :is-valid-query="isInvalidQuery"
      :query-to-execute=""
    ></slot>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, computed, getCurrentInstance } from 'vue'

  import { ElAlert, ElMessage } from 'element-plus'
  import { Download, DocumentAdd, VideoPlay } from '@element-plus/icons-vue'

  import CodeEditor from './code-editor.vue'
  // language
  import 'codemirror/mode/sql/sql'
  import 'codemirror/addon/hint/sql-hint'
  import 'codemirror/addon/search/searchcursor'
  import 'codemirror/addon/selection/mark-selection'
  import 'codemirror/lib/codemirror'

  import { TrinoSQL } from 'dt-sql-parser'

  export default defineComponent({
    components: {
      ElAlert,
      CodeEditor,
    },
    props: {
      modelValue: {
        type: String,
        default: '',
      },
      editorOptions: {
        type: Object,
        default: () => ({}),
      },
    },
    emits: ['update:model-value'],
    setup(props) {
      const sqlEditor = ref(null)
      const { appContext } = getCurrentInstance()!
      const computedCmOptions = computed(() => ({
        ...props.editorOptions,
        mode: 'text/x-sql',
        extraKeys: { 'Ctrl-Space': 'autocomplete' }, // To invoke the auto complete
        showHint: true,
        styleSelectedText: true,
      }))

      const codeEditor = () => sqlEditor.value.codeEditor.cminstance
      const codeEditorContent = () => codeEditor().getValue()

      const validationErrorTitle = ref('')
      const validationErrorMessages = ref('')
      const checkForValidationErrors = () => {
        const trinoParser = new TrinoSQL()
        const validationResults = trinoParser.validate(codeEditorContent())
        const validationErrorsFound = validationResults.length
        validationErrorMessages.value = validationErrorsFound
          ? validationResults
              .map(
                (result) =>
                  `Line ${result.startLine} column ${result.startColumn}: ${result.message}`
              )
              .join(', ')
          : ''
        validationErrorTitle.value = validationErrorsFound
          ? 'Please check your query'
          : ''
      }
      const isInvalidQuery = computed(
        () => validationErrorMessages.value || validationErrorTitle.value
      )

      const runQuery = () => {
        validationErrorTitle.value = ''
        validationErrorMessages.value = ''
        codeEditor()
          .getAllMarks()
          ?.forEach((marker) => {
            marker.clear()
          })
        const trinoParser = new TrinoSQL()
        const cursor = codeEditor().getCursor()
        const line = cursor.line
        const cursorPosition = cursor.ch
        const queries = trinoParser.splitSQLByStatement(codeEditorContent())
        const selectedQuery =
          queries?.find((query) => {
            const lineNumber = line + 1
            return (
              query.startLine <= lineNumber &&
              lineNumber <= query.endLine &&
              query.startIndex <= cursorPosition &&
              cursorPosition <= query.endIndex
            )
          }) || queries?.at(-1)
        if (selectedQuery) {
          checkForValidationErrors()
          if (!validationErrorMessages.value) {
            codeEditor().markText(
              {
                line: selectedQuery.startLine - 1,
                ch: selectedQuery.startColumn - 1,
              },
              {
                line: selectedQuery.endLine - 1,
                ch: selectedQuery.endColumn - 1,
              },
              { className: 'compass__code-editor__highlighted-text' }
            )
          }
        } else {
          checkForValidationErrors()
          if (!validationErrorMessages.value) {
            ElMessage(
              {
                showClose: true,
                message: 'Please enter a query to execute',
                type: 'error',
              },
              appContext
            )
          }
        }
      }

      return {
        Download,
        VideoPlay,
        DocumentAdd,
        sqlEditor,
        runQuery,
        computedCmOptions,
        isInvalidQuery,
        validationErrorTitle,
        validationErrorMessages,
      }
    },
  })
</script>

<style lang="scss" scoped>
  .compass__sql-editor {
    &__error {
      @apply max-h-[14vh] overflow-auto scrollbar my-4;
    }
    &__actions-container {
      @apply flex items-center gap-x-2;
    }
    :deep(.el-alert__title) {
      @apply font-semibold;
    }
  }
</style>
