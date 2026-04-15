import type { CommonResponse } from '~/types/api/common'
import type {
  FaultTreeDetailResponse,
  FaultTreeHistoryListResponse,
  GenerateFaultTreeRequest,
  ModifyFaultTreeDetailResponse,
  ModifyFaultTreeRequest
} from '~/types/api/faultTree'

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
  },
  getHistory() {
    return useFetch<FaultTreeHistoryListResponse>('/fault-trees', {
      baseURL: apiBaseUrl,
      method: 'GET'
    })
  },
  validate(data: ModifyFaultTreeRequest) {
    return useFetch<ModifyFaultTreeDetailResponse>('/fault-trees/validate', {
      baseURL: apiBaseUrl,
      body: data,
      method: 'POST'
    })
  }
}
