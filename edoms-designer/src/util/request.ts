import { Request } from '@edoms/utils'

const request = new Request({
  baseURL: '',
  timeout: 1000 * 60 * 5,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
  },
  interceptors: {
    requestInterceptors: {
      then(config) {
        return config
      },
      catch(err) {
        return Promise.reject(err)
      },
    },
  },
})

export default request
