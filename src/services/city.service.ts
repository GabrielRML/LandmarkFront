import axios from 'axios'
import apiConfig from './api.config'
import type { ICity } from '../types/city.interface'

const api = axios.create(apiConfig)

export const getCities = (stateId: number) => {
  return api.get<ICity[]>(`/cities/state/${stateId}`)
}
