import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios'
import { ElMessage } from 'element-plus'

class APIError extends Error {
  data: any
  constructor(message, data) {
    super(message)
    this.name = 'APIError'
    this.data = data
  }
}

export const errorHandleConfigProperty = 'errorHandle'

export const errorMessageFromAxiosErr = (error: AxiosError) => {
  const errorResponseData = error.response?.data
  // @ts-expect-error reading the error message on the "message" property
  return errorResponseData?.message || JSON.stringify(errorResponseData)
}

export const apiStatusHandler = (error) => {
  let message = ''
  console.error('API_ERROR', error)
  if (error.response) {
    message = errorMessageFromAxiosErr(error)
    if (message) {
      ElMessage.error(message)
      return true
    }
  }
  return false
}
// Default config for the axios instance
const axiosParams = {
  // Set different base URL based on the environment
  baseURL: (import.meta.env.VITE_AUTH_API_URL as string) + '/',
}
// Create axios instance with default params
const axiosInstance: AxiosInstance = axios.create(axiosParams)
// Request interceptor something before request is sent
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    config.headers['Content-type'] =
      config.headers['Content-type'] || 'application/json'

    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

const responseHandler = (response: AxiosResponse) => {
  if (response['error'] != null) {
    const error: AxiosError = {
      response: response,
      config: response.config,
      code: '400',
      request: response.request,
      isAxiosError: true,
      name: 'Error',
      message: 'Error occurred',
      toJSON: () => ({}),
    }
    errorHandler(error)
    return Promise.reject(response)
  }
  return response.data
}

const errorHandler = async (error: AxiosError) => {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  // check for errorHandle config
  if (
    error &&
    error.config &&
    // eslint-disable-next-line no-prototype-builtins
    error.config.hasOwnProperty(errorHandleConfigProperty) &&
    error.config[errorHandleConfigProperty] === false
  ) {
    return Promise.reject(error)
  }
  // if has response show the error
  if (error.response) {
    const handled = apiStatusHandler(error)
    if (!handled) {
      const message = errorMessageFromAxiosErr(error)
      throw new APIError(message, error.response.data)
    }
    return Promise.reject(new APIError('Error occurred', error)) // here it was Promise.resolve
  } else {
    return Promise.reject(error)
  }
}

// Response interceptor to handle api response before forwarding to the called function
axiosInstance.interceptors.response.use(
  (response) => responseHandler(response),
  (error) => errorHandler(error)
)

// Main api function
const api = (axios: AxiosInstance) => {
  // Wrapper functions around axios
  return {
    get: (url: string, config: AxiosRequestConfig = {}) =>
      axios.get(url, config),
    post: (
      url: string,
      body: Record<string, unknown>,
      config: AxiosRequestConfig = {}
    ) => axios.post(url, body, config),
    put: (
      url: string,
      body: Record<string, unknown>,
      config: AxiosRequestConfig = {}
    ) => axios.put(url, body, config),
    patch: (
      url: string,
      body: Record<string, unknown>,
      config: AxiosRequestConfig = {}
    ) => axios.patch(url, body, config),
    delete: (url: string, config: AxiosRequestConfig = {}) =>
      axios.delete(url, config),
    request: async <T>(config: AxiosRequestConfig): Promise<T> => {
      return axios.request(config)
    },
  }
}
// Initialise the api function and pass axiosInstance to it
export default api(axiosInstance)
