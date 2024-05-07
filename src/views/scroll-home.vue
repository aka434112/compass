<template>
  <div v-if="listUsers" class="infinite-scroll__container">
    <div
      v-for="user in users?.concat([...users, ...users, ...users])"
      :key="user.id"
      :class="`infinite-scroll__item ${user.id}`"
    >
      {{ user.email }}
    </div>
  </div>
  <div v-else-if="!isLoading">No data found</div>
  <div v-else>Fetching users...</div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref, computed, Ref } from 'vue'

  import { isNumber } from 'lodash-es'
  import { useSetLoading } from '@/composables/set-loading'

  import { IUser } from '@/api/models'
  import { fetchUsers } from '@/api/services/users-svc'

  export default defineComponent({
    setup() {
      let totalUsersCount
      const users: Ref<IUser[] | undefined> = ref()
      const currentPage = ref(0)
      const pageSize = ref(5)

      const { isLoading, setLoadingState } = useSetLoading()

      const listUsers = computed(
        () => Array.isArray(users.value) && users.value.length
      )
      const fetchScrollItems = async () => {
        if (
          isNumber(totalUsersCount)
            ? (users.value?.length || 0) < totalUsersCount
            : true
        ) {
          setLoadingState(true)
          currentPage.value += 1
          try {
            const currentPageUsers = await fetchUsers({
              page: currentPage.value,
              page_size: pageSize.value,
            })
            totalUsersCount = currentPageUsers?.total
            users.value = (users.value || []).concat(
              currentPageUsers.data || []
            )
          } catch (e) {
            console.error(e)
          } finally {
            setLoadingState(false)
          }
        }
      }

      const fetchNextPageOfUsers = (event) => {
        if (event[0]?.isIntersecting) fetchScrollItems()
      }
      onMounted(() => {
        fetchScrollItems().then(() => {
          if (listUsers.value) {
            const currentListEndUser = users.value?.at(-1)?.id as string
            const observer = new IntersectionObserver(fetchNextPageOfUsers, {
              threshold: 0.5,
            })
            const userDomNodes =
              document.getElementsByClassName(currentListEndUser)
            const userToObserve = userDomNodes[userDomNodes?.length - 1]
            observer.observe(userToObserve)
          }
        })
      })

      return {
        users,
        listUsers,
        isLoading,
      }
    },
  })
</script>

<style lang="scss" scoped>
  .infinite-scroll {
    &__container {
      @apply h-full w-full;
    }
    &__item {
      @apply p-4 border-b border-l border-r border-primary;
      &:hover {
        @apply bg-primary-background;
      }
      &:first-child {
        @apply border-t;
      }
    }
  }
</style>
