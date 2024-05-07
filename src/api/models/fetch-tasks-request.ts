import { IPaginatedResponse } from './paginated-response'

export interface IFetchTasksRequest {
  search_term?: string
  page: number
  page_size: number
  filter_status: TaskStatusEnum[]
  filter_created_at: Date[]
  filter_finished_at: Date[]
  filter_type: TaskTypeEnum[]
}

export enum TaskStatusEnum {
  Finished = 'Finished',
  FAILED = 'Failed',
  IN_PROGRESS = 'In-Progress',
}

export enum TaskTypeEnum {
  VISUALIZE_QUERY = 'VISUALIZE_QUERY',
  EXECUTE_QUERY = 'EXECUTE_QUERY',
}

export interface ITask {
  name: string
  created_at: number
  type: TaskTypeEnum
  finished_at: number
  status: TaskStatusEnum
  id: string
}

export interface ITasksPaginated extends IPaginatedResponse<ITask> {}
