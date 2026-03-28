import { camelCase } from 'es-toolkit'

export const apiBaseUrl = '/api/v1'

function convertKeysToCamelCase(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(item => convertKeysToCamelCase(item))
  if (obj && typeof obj === 'object')
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [camelCase(k), convertKeysToCamelCase(v)]))

  return obj
}

export const apiFetch = $fetch.create({
  baseURL: apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
  onResponse({ response }) {
    response._data = convertKeysToCamelCase(response._data)
  },
  onResponseError({ response }) {
    const toast = useToast()
    const msg = response._data?.msg ?? '请求失败'

    if (response.status === 404) toast.add({ color: 'error', description: '资源不存在', title: '错误' })
    else if (response.status === 400) toast.add({ color: 'error', description: msg, title: '参数错误' })
    else if (response.status >= 500) toast.add({ color: 'error', description: msg, title: '服务器错误' })
    else toast.add({ color: 'error', description: msg, title: '请求失败' })

    return Promise.reject(response._data)
  }
})
