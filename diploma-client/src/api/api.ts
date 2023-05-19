import Axios, {AxiosResponse} from 'axios'
import {TokenWithSummary} from '../types/TokenWithSummary';

const api = Axios.create()
const authApi = Axios.create()
const adminApi = Axios.create()

if (process.env.NODE_ENV === 'development') {
  api.defaults.baseURL = 'http://localhost:8080/api/word-articles'
  authApi.defaults.baseURL = 'http://localhost:8080/api/users/token'
  adminApi.defaults.baseURL = 'http://localhost:8080/api/users'
} else {
  api.defaults.baseURL = "/api/word-articles"
  authApi.defaults.baseURL = '/api/users/token';
  adminApi.defaults.baseURL = '/api/users'
}

export const Api = {
  get(url: string, params ?: any): Promise<AxiosResponse> {
    return api.get(url, {params})
  },

  post(url: string, data?: object, params?: object): Promise<AxiosResponse>{
    return api.post(url, data, {params})
  },

  put(url: string, data?: object, params ?: object): Promise<AxiosResponse>{
    return api.put(url, data, {params})
  },

  delete(url: string, params?: object): Promise<AxiosResponse>{
    return api.delete(url, {params})
  },

  Auth: {
    getToken(email: string, password: string): Promise<TokenWithSummary> {
      return authApi.post('/access-with-summary', {email, password}).then(data => data.data)
    },

    refreshToken(refreshToken: string): Promise<TokenWithSummary> {
      return authApi.post('/refresh-with-summary', {refreshToken}).then(data => data.data)
    }
  },

  Admin: {
    findAll(): Promise<AxiosResponse> {
      return adminApi.get('/')
    },

    createAdmin(email: string): Promise<AxiosResponse> {
      return adminApi.post('/', {email})
    },

    updatePassword(oldPassword: string, newPassword: string): Promise<AxiosResponse> {
      return adminApi.patch('/password', {oldPassword, newPassword})
    },

    deleteById(id: any) {
      return adminApi.delete(`/${id}`)
    }
  },

  setAuthToken(token: string) {
    api.defaults.headers.Authorization = `Bearer ${token}`
    adminApi.defaults.headers.Authorization = `Bearer ${token}`
  }
}