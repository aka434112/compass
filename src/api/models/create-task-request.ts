import { TaskTypeEnum } from './'

export interface ICreateTaskRequest {
  type: TaskTypeEnum
  query: string
  database: string
  name?: string
}
