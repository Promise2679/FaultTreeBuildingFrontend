import type { CommonResponse } from '~/types/api/common'
import type {
  CreateNodeDetailResponse,
  CreateNodeRequest,
  GetNodeDetailResponse,
  UpdateNodeRequest
} from '~/types/api/faultTreeNode'

import { apiBaseUrl } from './request'

export const faultTreeNodeApi = {
  create(faultTreeId: number, data: CreateNodeRequest) {
    return useFetch<CreateNodeDetailResponse>(`/fault-trees/${faultTreeId}/nodes`, {
      baseURL: apiBaseUrl,
      body: data,
      method: 'POST'
    })
  },
  delete(faultTreeId: number, nodeId: string) {
    return useFetch<CommonResponse>(`/fault-trees/${faultTreeId}/nodes/${nodeId}`, {
      baseURL: apiBaseUrl,
      method: 'DELETE'
    })
  },
  getById(faultTreeId: number, nodeId: string) {
    return useFetch<GetNodeDetailResponse>(`/fault-trees/${faultTreeId}/nodes/${nodeId}`, {
      baseURL: apiBaseUrl,
      method: 'GET'
    })
  },
  update(faultTreeId: number, nodeId: string, data: UpdateNodeRequest) {
    return useFetch<CommonResponse>(`/fault-trees/${faultTreeId}/nodes/${nodeId}`, {
      baseURL: apiBaseUrl,
      body: data,
      method: 'PUT'
    })
  }
}
