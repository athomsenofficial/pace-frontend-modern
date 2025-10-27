import axios from 'axios'

// Configure base URL for API calls
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// MEL Upload Endpoints
export const uploadInitialMEL = async (file: File, cycle: string, year: string) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('cycle', cycle)
  formData.append('year', year)

  const response = await api.post('/api/upload/initial-mel', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export const uploadFinalMEL = async (file: File, cycle: string, year: string) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('cycle', cycle)
  formData.append('year', year)

  const response = await api.post('/api/upload/final-mel', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

// PDF Generation Endpoints
export const submitInitialMELPascodes = async (
  sessionId: string,
  pascodeInfo: Record<string, any>
) => {
  const response = await api.post(
    '/api/initial-mel/submit/pascode-info',
    {
      session_id: sessionId,
      pascode_info: pascodeInfo,
    },
    { responseType: 'blob' }
  )
  return response.data
}

export const submitFinalMELPascodes = async (
  sessionId: string,
  pascodeInfo: Record<string, any>
) => {
  const response = await api.post(
    '/api/final-mel/submit/pascode-info',
    {
      session_id: sessionId,
      pascode_info: pascodeInfo,
    },
    { responseType: 'blob' }
  )
  return response.data
}

// Download Blob Utility
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

export default api
