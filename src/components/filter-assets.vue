<template>
  <div class="compass__assets">
    <el-input
      v-model="assetFilterQuery"
      :prefix-icon="Search"
      class="compass__assets__search-assets"
    />
    <div class="compass__assets__heading">
      <h2>
        {{
          filteringAssets
            ? 'Assets matching your search'
            : 'Assets you recently accessed'
        }}
      </h2>
      <el-icon v-if="!filteringAssets">
        <Clock />
      </el-icon>
    </div>
    <div class="compass__assets__tree-list">
      <el-tree
        :data="filteringAssets ? filteredAssets : recentAssets"
        :props="{
          label: 'name',
          children: 'columns',
        }"
        default-expand-all
        @node-click="handleAssetSelection"
      ></el-tree>
      <el-tooltip
        v-if="filteringAssets && !noMoreFilteredAssetsToFetch"
        content="Load more assets"
        placement="top"
      >
        <el-button
          link
          :icon="MoreFilled"
          type="primary"
          class="compass__assets__load-more-assets"
          @click="fetchNextFilteredAssets"
        />
      </el-tooltip>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, Ref, watch, computed, onMounted } from 'vue'

  import { ElIcon, ElTree, ElInput } from 'element-plus'
  import { Search, Clock, MoreFilled } from '@element-plus/icons-vue'

  import { usePaging } from '@/composables/pagination'

  import { IAsset, IAssetColumn, IAssetsPaginated } from '@/api/models'
  import {
    fetchAssets,
    fetchAssetDetails,
    fetchRecentAssets,
  } from '@/api/services/assets'

  export interface IAssetDetails extends IAsset {
    columns?: IAssetColumn[]
  }

  export default defineComponent({
    components: {
      Clock,
      ElIcon,
      ElTree,
      ElInput,
    },
    emits: ['asset-selected'],
    setup(props, { emit }) {
      const assetFilterQuery = ref('')
      const recentAssets: Ref<IAssetDetails[] | undefined> = ref()
      const filteringAssets = ref(false)
      const filteredAssets: Ref<IAssetDetails[] | undefined> = ref()
      const noMoreFilteredAssetsToFetch = ref(false)
      const {
        search,
        nextPage,
        results: assetResults,
      } = usePaging<IAssetsPaginated>(async (page, pageSize) => {
        filteringAssets.value = true
        return fetchAssets({
          page,
          page_size: pageSize,
          search_term: assetFilterQuery.value,
        })
      })

      const checkForMoreAssets = async () => {
        noMoreFilteredAssetsToFetch.value = true
        if (
          (filteredAssets.value?.length as number) <
          (assetResults.value?.total_count as number)
        )
          noMoreFilteredAssetsToFetch.value = false
      }
      watch(assetFilterQuery, async (val: string) => {
        const filteredAssetsPaginated = await search()
        filteredAssets.value = filteredAssetsPaginated.results
        checkForMoreAssets()
      })
      const fetchNextFilteredAssets = async () => {
        const searchResultsForAssets = await nextPage()
        filteredAssets.value = filteredAssets.value?.concat(
          searchResultsForAssets?.results
        )
        checkForMoreAssets()
      }

      const fetchingAssetDetails = ref(false)
      const updateAssetWithColumns = async (asset: IAsset, ref: Ref) => {
        try {
          fetchingAssetDetails.value = true
          const assetDetails = await fetchAssetDetails(asset.id)
          ref.value = ref.value.map((column) => ({
            ...column,
            ...(column.name === asset
              ? {
                  columns: assetDetails.columns,
                }
              : {}),
          }))
        } catch (err) {
          console.error(err)
        } finally {
          fetchingAssetDetails.value = false
        }
      }
      const handleAssetSelection = (event) => {
        if (event.database) {
          updateAssetWithColumns(
            event,
            filteringAssets.value ? filteredAssets : recentAssets
          )
          emit('asset-selected', event as IAssetDetails)
        }
      }

      onMounted(async () => {
        recentAssets.value = await fetchRecentAssets()
      })

      return {
        Search,
        MoreFilled,
        recentAssets,
        filteredAssets,
        filteringAssets,
        assetFilterQuery,
        handleAssetSelection,
        fetchNextFilteredAssets,
        noMoreFilteredAssetsToFetch,
      }
    },
  })
</script>

<style lang="scss" scoped>
  .compass__assets {
    @apply flex flex-col gap-y-2 h-full;
    &__heading {
      @apply flex items-center gap-x-2;
    }
    &__load-more-assets {
      @apply ml-5;
    }
    &__tree-list {
      @apply overflow-y-auto scrollbar;
    }
  }
</style>
