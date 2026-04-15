import type { CommonResponse } from '~/types/api/common'
import type {
  CreateNodeDetailResponse,
  CreateNodeRequest,
  GetNodeDetailResponse,
  UpdateNodeRequest
} from '~/types/api/faultTreeNode'

import { apiFetch } from './request'

export const faultTreeNodeApi = {
  create(faultTreeId: number, data: CreateNodeRequest) {
    return apiFetch<CreateNodeDetailResponse>(`/fault-trees/${faultTreeId}/nodes`, {
      body: data,
      method: 'POST'
    })
  },
  delete(faultTreeId: number, nodeId: string) {
    return apiFetch<CommonResponse>(`/fault-trees/${faultTreeId}/nodes/${nodeId}`, {
      method: 'DELETE'
    })
  },
  getById(faultTreeId: number, nodeId: string) {
    return apiFetch<GetNodeDetailResponse>(`/fault-trees/${faultTreeId}/nodes/${nodeId}`, {
      method: 'GET'
    })
  },
  update(faultTreeId: number, nodeId: string, data: UpdateNodeRequest) {
    return apiFetch<CommonResponse>(`/fault-trees/${faultTreeId}/nodes/${nodeId}`, {
      body: data,
      method: 'PUT'
    })
  }
}
