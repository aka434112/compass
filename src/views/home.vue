<template>
  <div class="compass__home">
    <filter-assets
      class="compass__home__asset-selection"
      @asset-selected="
        (asset) => {
          selectedAsset = asset
          setDefaultSqlQuery()
        }
      "
    />
    <div class="compass__home__sql-editor-container">
      <sql-editor v-if="selectedAsset" v-model="sqlQuery">
        <template #after-editor>
          <div class="compass__sql-editor__actions-container">
            <slot name="run-query" :run-query="runQuery">
              <el-button type="primary" :icon="VideoPlay" @click="runQuery">
                Run Query
              </el-button>
              <el-button
                type="primary"
                :icon="DocumentAdd"
                plain
                @click="saveContent"
              >
                Save Query
              </el-button>
              <el-button :icon="Download" plain @click="loadSavedContent">
                Load Saved Query
              </el-button>
            </slot>
            <slot name="query-actions"></slot>
          </div>
        </template>
      </sql-editor>
    </div>
  </div>
</template>

<script lang="ts">
  import { ref, Ref, onMounted, defineComponent } from 'vue'

  import {
    ElButton,
    ElOption,
    ElTree,
    ElTable,
    ElTableColumn,
    ElDialog,
    ElPagination,
  } from 'element-plus'
  import { DocumentAdd, Download } from '@element-plus/icons-vue'
  import SqlEditor from '@/components/sql-editor.vue'
  import FilterAssets, { IAssetDetails } from '@/components/filter-assets.vue'

  import { createTask } from '@/api/services/tasks'
  import {
    fetchedSavedQueryContent,
    saveDatabaseQueryContent,
  } from '@/api/services/assets'

  export default defineComponent({
    components: {
      ElButton,
      ElOption,
      ElTree,
      ElTable,
      ElTableColumn,
      ElPagination,
      SqlEditor,
      FilterAssets,
    },
    setup() {
      const chartModalVisible = ref(false)
      const tableData = ref()
      const queryResult = ref(null)
      const selectedAsset: Ref<IAssetDetails | undefined> = ref()
      const sqlQuery = ref()
      const setDefaultSqlQuery = () => {
        sqlQuery.value = `select * from ${selectedAsset.value?.name} limit 100;`
      }

      const saveContent = async () => {
        await saveDatabaseQueryContent({
          query: codeEditorContent(),
          name: '',
        })
      }

      const loadSavedContent = async () => {}

      const createTaskForQuery = async (query) => {
        try {
          await createTask({
            query,
          })
        } catch (err) {
          console.error(err)
        } finally {
        }
      }

      return {
        sqlQuery,
        setDefaultSqlQuery,
        tableData,
        queryResult,
        selectedAsset,
        DocumentAdd,
        Download,
        chartModalVisible,
        saveContent,
        loadSavedContent,
        createTaskForQuery,
      }
    },
  })
</script>

<style lang="scss" scoped>
  .compass__home {
    @apply flex items-start gap-x-16;
    &__asset-selection {
      @apply min-w-max;
    }
    &__sql-editor-container {
      @apply w-full;
    }
    &__sql-results-header {
      @apply flex items-center justify-between my-4;
    }
    &__sql-results-action-container {
      @apply flex items-center gap-x-4;
    }
    &__sql-results-action {
      @apply transform scale-150;
    }
  }
</style>
