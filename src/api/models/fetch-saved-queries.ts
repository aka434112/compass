import { IFetchAssetsRequest } from './'
import { IPaginatedResponse } from './paginated-response'

export interface IFetchSavedQueries extends IFetchAssetsRequest {
  filter_database?: string[]
}

export interface ISavedQuery {
  name: string
  query: string
  database: string
}

export interface ISavedQueriesPaginated
  extends IPaginatedResponse<ISavedQuery> {}
