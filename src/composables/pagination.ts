import { ref, watch } from 'vue'

export const usePaging = <T>(
  fn: (page: number, pageSize: number) => Promise<T>,
  options: {
    initialPage?: number
    initialPageSize?: number
    handleResults?: Function
  } = {
    initialPage: 0,
    initialPageSize: 10,
    handleResults: undefined,
  }
) => {
  let pageSize = options.initialPageSize || 10
  let page = options.initialPage || 1
  const results = ref<T>()

  const fetchResults = async () => {
    const handleResults = options?.handleResults
    const _results = await fn(page, pageSize)
    if (handleResults) results.value = await handleResults(_results)
    else results.value = _results
    return results.value
  }

  return {
    reset: () => {
      page = 1
      results.value = undefined
      return fetchResults() as Promise<T>
    },
    previousPage: () => {
      page--
      return fetchResults() as Promise<T>
    },
    nextPage: () => {
      page++
      return fetchResults() as Promise<T>
    },
    search: () => {
      page = 1
      return fetchResults() as Promise<T>
    },
    setPage: (page: number) => {
      page = page
      return fetchResults() as Promise<T>
    },
    setPageSize: (pageSize: number) => {
      pageSize = pageSize
      return fetchResults() as Promise<T>
    },
    results,
  }
}
