import axios from '../api-client'
import { AxiosRequestConfig } from 'axios'
import Assets from '@/api/mocks/assets.json'
import {
  IAsset,
  IAssetDetails,
  ISavedQuery,
  IAssetsPaginated,
  IFetchAssetsRequest,
  IFetchSavedQueries,
  ISavedQueriesPaginated,
} from '@/api/models'

const SAVED_QUERIES_LOCAL_STORAGE_KEY = 'COMPASS_SAVED_QUERIES'

export const fetchAssets = async (
  request: IFetchAssetsRequest,
  config?: AxiosRequestConfig
): Promise<IAssetsPaginated> => {
  /* Should've ideally looked something like this
  return axios.request({
    ...config,
    url: `/api/assets?search_term=${encodeURIComponent(
      request.search_term || ''
    )}&page=${request.page}&page_size=${request.page_size}`,
    method: 'GET',
  })
*/

  // Mocking the data for now
  const page = request?.page || 1
  const pageSize = request?.page_size || 10
  const searchTerm = request?.search_term || ''
  const filteredAssets = Assets.filter((asset) =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const allAssets = searchTerm ? filteredAssets : Assets
  return {
    total_count: allAssets.length,
    page,
    page_size: pageSize,
    results: allAssets.slice((page - 1) * pageSize, page * pageSize),
  }
}

export const fetchAssetDetails = async (
  id: string,
  config?: AxiosRequestConfig
): Promise<IAssetDetails> => {
  /* Should've ideally looked something like this
  return axios.request({
    ...config,
    url: `/api/asset/${id}`,
    method: 'GET',
  })
*/

  // Mocking the data for now
  const asset = Assets.find((asset) => asset.id === id) as IAsset
  return {
    ...asset,
    columns: [
      {
        name: 'Column 1',
        type: 'string',
        created_at: 1709015433456,
      },
      {
        name: 'Column 2',
        type: 'number',
        created_at: 1709015433456,
      },
      {
        name: 'Column 3',
        type: 'number',
        created_at: 1709015433456,
      },
      {
        name: 'Column 4',
        type: 'string',
        created_at: 1709015433456,
      },
      {
        name: 'Column 5',
        type: 'string',
        created_at: 1709015433456,
      },
      {
        name: 'Column 6',
        type: 'number',
        created_at: 1709015433456,
      },
      {
        name: 'Column 7',
        type: 'string',
        created_at: 1709015433456,
      },
      {
        name: 'Column 8',
        type: 'string',
        created_at: 1709015433456,
      },
      {
        name: 'Column 9',
        type: 'string',
        created_at: 1709015433456,
      },
    ],
  }
}

// Return the 10 assets that were used on a frequent basis by the user
export const fetchRecentAssets = async (
  config?: AxiosRequestConfig
): Promise<IAsset[]> => {
  /* Should've ideally looked something like this
  return axios.request({
    ...config,
    url: `/api/assets?recent=true`,
    method: 'GET',
  })
*/

  // Mocking the data for now
  return Assets.slice(3, 13)
}

export const saveDatabaseQueryContent = async (
  request: ISavedQuery,
  config?: AxiosRequestConfig
): Promise<void> => {
  /* Should've ideally looked something like this
  return axios.request({
    ...config,
    url: `/api/assets/save_query`,
    method: 'POST',
    payload: {
      database,
      query
    }
  })
*/
  const savedQueries = JSON.parse(
    localStorage.getItem(SAVED_QUERIES_LOCAL_STORAGE_KEY) || '{}'
  )
  savedQueries[request.database] = [
    request,
    ...(savedQueries[request.database] || []),
  ]
  localStorage.setItem(
    SAVED_QUERIES_LOCAL_STORAGE_KEY,
    JSON.stringify(savedQueries)
  )
}

export const fetchedSavedQueryContent = async (
  request: IFetchSavedQueries,
  config?: AxiosRequestConfig
): Promise<ISavedQueriesPaginated> => {
  const page = request?.page || 1
  const pageSize = request?.page_size || 20
  const searchTerm = request?.search_term?.trim().toLowerCase() || ''
  const databases = (request?.filter_database || []).filter(
    (database) => database?.trim() || ''
  )
  /* Should've ideally looked something like this
  return axios.request({
    ...config,
    url: `/api/assets?search_term=${encodeURIComponent(
      request.search_term || ''
    )}&page=${request.page}&page_size=${request.page_size}&databases=${databases.join(',')}`,
    method: 'GET',
  })
*/
  const savedQueries = JSON.parse(
    localStorage.getItem(SAVED_QUERIES_LOCAL_STORAGE_KEY) || '{}'
  )
  const savedContents = databases.length
    ? databases.map((database) => savedQueries[database] || []).flat()
    : Object.values(savedQueries)
  const filterContents = searchTerm
    ? savedContents.filter((content) =>
        content.name.toLowerCase().includes(searchTerm)
      )
    : savedContents

  return {
    page,
    page_size: pageSize,
    total_count: filterContents.length,
    results: filterContents.slice((page - 1) * pageSize, page * pageSize),
  }
}
