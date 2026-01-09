import axios from 'axios'
import type { IEstado, IMunicipio } from '../types/IBGE.interface'

export const getStates = () => {
  return axios.get<IEstado[]>("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
}

export const getCities = (ufId: number) => {
  return axios.get<IMunicipio[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufId}/municipios?orderBy=nome`)
}
