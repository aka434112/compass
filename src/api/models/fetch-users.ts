export interface IFetchUsers {
  page: number
  page_size: number
}

export interface IUser {
  id: string
  first_name: string
  last_name: string
  email: string
  avatar: string
}

export interface IListUsersResponse {
  page: number
  per_page: number
  total: number
  total_pages: number
  data: IUser[]
}

export default IFetchUsers
