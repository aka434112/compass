import { IPaginatedResponse } from './paginated-response'

export interface IFetchAssetsRequest {
  search_term?: string
  page: number
  page_size: number
}

export interface IAsset {
  name: string
  created_at: number
  database: string
  updated_at: number
  id: string
}

export interface IAssetColumn {
  name: string
  type: string
  created_at: number
}

export interface IAssetDetails extends IAsset {
  columns: IAssetColumn[]
}

export interface IAssetsPaginated extends IPaginatedResponse<IAsset> {}
