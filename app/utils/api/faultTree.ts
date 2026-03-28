import type { CommonResponse } from '~/types/api/common'
import type { FaultTreeDetailResponse, GenerateFaultTreeRequest } from '~/types/api/faultTree'

import { apiBaseUrl } from './request'

export const faultTreeApi = {
  delete(id: number) {
    return useFetch<CommonResponse>(`/fault-trees/${id}`, {
      baseURL: apiBaseUrl,
      method: 'DELETE'
    })
  },
  generate(data: GenerateFaultTreeRequest) {
    return useFetch<FaultTreeDetailResponse>('/fault-trees/generate', {
      baseURL: apiBaseUrl,
      body: data,
      method: 'POST'
    })
  },
  getById(id: number) {
    return useFetch<FaultTreeDetailResponse>(`/fault-trees/${id}`, {
      baseURL: apiBaseUrl,
      method: 'GET'
    })
  }
}
