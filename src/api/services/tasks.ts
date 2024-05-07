import axios from '../api-client'
import { AxiosRequestConfig } from 'axios'
import Tasks from '@/api/mocks/tasks.json'
import {
  ITask,
  TaskStatusEnum,
  TaskTypeEnum,
  ITasksPaginated,
  ICreateTaskRequest,
  IFetchTasksRequest,
} from '@/api/models'

export const fetchTasks = async (
  request: IFetchTasksRequest,
  config?: AxiosRequestConfig
): Promise<ITasksPaginated> => {
  const page = request?.page || 1
  const pageSize = request?.page_size || 50
  const searchTerm = request?.search_term || ''
  /* Should've ideally looked something like this
    return axios.request({
      ...config,
      url: `/api/tasks`,
      method: 'POST',
      body: request
    })
  */

  // Mocking the data for now
  const filteredTasks = (Tasks as ITask[]).filter(
    (task) =>
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (request?.filter_status?.length
        ? request.filter_status
        : Object.values(TaskStatusEnum)
      ).includes(task.status as TaskStatusEnum) &&
      (request?.filter_type?.length
        ? request.filter_type
        : Object.values(TaskTypeEnum)
      ).includes(task.type as TaskTypeEnum)
  )
  return {
    page,
    page_size: pageSize,
    total_count: filteredTasks.length,
    results: filteredTasks.slice((page - 1) * pageSize, page * pageSize),
  }
}

export const createTask = async (
  request: ICreateTaskRequest,
  config?: AxiosRequestConfig
): Promise<ITask> => {
  /* Should've ideally looked something like this
      return axios.request({
        ...config,
        url: `/api/task`,
        method: 'POST',
        body: request
      })
    */

  return {
    created_at: 1708969729365,
    finished_at: 0,
    id: '10a15c043-0a15-c043-1-288be6e2a869',
    type: request.type,
    name: request?.name || '28_01_2024_22_52_12_EXECUTE_QUERY',
    status: TaskStatusEnum.IN_PROGRESS,
  }
}
