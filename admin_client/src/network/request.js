import axios from "axios"
export const request = (config) => {
  const instance = axios.create({
    baseURL:'http://127.0.0.1:8888/api/private/v1/',
    timeout:'5000'
  })
  instance.interceptors.request.use(config => {
    config.headers.Authorization = sessionStorage.getItem("token")
    return config
  })
  instance.interceptors.response.use(data => {
    return data.data
  })
  return instance(config)
}
