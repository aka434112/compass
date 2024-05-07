import { ref, computed, ComputedRef } from 'vue'

const loading = ref(false)

export const useSetLoading = function () {
  return {
    isLoading: computed(() => loading.value) as ComputedRef<boolean>,
    setLoadingState: (isLoading: boolean): void => {
      loading.value = isLoading
    },
  }
}
