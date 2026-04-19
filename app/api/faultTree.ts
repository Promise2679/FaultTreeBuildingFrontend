import type { CommonResponse } from '~/types/api/common'
import type {
  ChatHistoryListResponse,
  FaultTreeDetailResponse,
  FaultTreeHistoryListResponse,
  GenerateFaultTreeRequest,
  ModifyFaultTreeDetailResponse,
  ModifyFaultTreeRequest
} from '~/types/api/faultTree'

import { apiFetch } from './request'

export const faultTreeApi = {
  delete(id: number) {
    return apiFetch<CommonResponse>(`/fault-trees/${id}`, {
      method: 'DELETE'
    })
  },
  generate(data: GenerateFaultTreeRequest) {
    return apiFetch<FaultTreeDetailResponse>('/fault-trees/generate', {
      body: data,
      method: 'POST'
    })
  },
  getById(id: number) {
    return apiFetch<FaultTreeDetailResponse>(`/fault-trees/${id}`, {
      method: 'GET'
    })
  },
  getChatHistory(id: number) {
    return apiFetch<ChatHistoryListResponse>(`/fault-trees/${id}/chat-history`, {
      method: 'GET'
    })
  },
  getHistory() {
    return apiFetch<FaultTreeHistoryListResponse>('/fault-trees', {
      method: 'GET'
    })
  },
  validate(data: ModifyFaultTreeRequest) {
    return apiFetch<ModifyFaultTreeDetailResponse>('/fault-trees/validate', {
      body: data,
      method: 'POST'
    })
  }
}
