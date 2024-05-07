import { IFetchUsers, IListUsersResponse } from '@/api/models'

export const fetchUsers = async (
  request: IFetchUsers
): Promise<IListUsersResponse> => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      resolve(
        await fetch(
          `https://reqres.in/api/users?page=${request.page}&per_page=${request.page_size}`
        )
          .then((response) => response.json())
          .then((users) => users)
      )
    }, 1000)
  })
}
