import axios from 'axios'
import apiConfig from './api.config'
import type { IState } from '../types/state.interface'

const api = axios.create(apiConfig)

export const getStates = () => {
  return api.get<IState[]>("/states")
}
