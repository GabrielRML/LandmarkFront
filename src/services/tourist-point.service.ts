import axios from 'axios'
import apiConfig from './api.config'
import type { IPagedResult } from '../types/paged-result.interface'
import type { ITouristPoint } from '../types/tourist-point.interface'
import type { ICreateTouristPointDto, IUpdateTouristPointDto } from '../types/tourist-point-dto.interface'

export interface GetTouristPointsParams {
  pageNumber?: number
  pageSize?: number
  name?: string
}

class TouristPointService {
  private baseURL: string

  constructor() {
    this.baseURL = `${apiConfig.baseURL}/tourist-points`
  }

  async getTouristPoints(
    params: GetTouristPointsParams = {}
  ): Promise<IPagedResult<ITouristPoint>> {
    const { pageNumber = 1, pageSize = 10, name } = params

    const queryParams = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    })

    if (name) {
      queryParams.append('name', name)
    }

    const response = await axios.get<IPagedResult<ITouristPoint>>(
      `${this.baseURL}?${queryParams.toString()}`,
      { headers: apiConfig.headers }
    )

    return response.data
  }

  async getTouristPointById(id: string): Promise<ITouristPoint> {
    const response = await axios.get<ITouristPoint>(
      `${this.baseURL}/${id}`,
      { headers: apiConfig.headers }
    )

    return response.data
  }

  async createTouristPoint(
    data: ICreateTouristPointDto
  ): Promise<ITouristPoint> {
    const response = await axios.post<ITouristPoint>(
      this.baseURL,
      data,
      { headers: apiConfig.headers }
    )

    return response.data
  }

  async updateTouristPoint(
    id: string,
    data: IUpdateTouristPointDto
  ): Promise<ITouristPoint> {
    const response = await axios.put<ITouristPoint>(
      `${this.baseURL}/${id}`,
      data,
      { headers: apiConfig.headers }
    )

    return response.data
  }

  async deleteTouristPoint(id: string): Promise<void> {
    await axios.delete(
      `${this.baseURL}/${id}`,
      { headers: apiConfig.headers }
    )
  }
}

export const touristPointService = new TouristPointService()
export default touristPointService
