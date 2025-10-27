import api from './api'

export interface RosterMember {
  member_id: string
  FULL_NAME: string
  GRADE: string
  SSAN: string
  DOR: string
  ASSIGNED_PAS: string
  ASSIGNED_PAS_CLEARTEXT: string
  DAFSC?: string
  PAFSC: string
  TAFMSD: string
  DATE_ARRIVED_STATION?: string
  REENL_ELIG_STATUS?: string
  UIF_CODE?: number
  GRADE_PERM_PROJ?: string
  UIF_DISPOSITION_DATE?: string
  '2AFSC'?: string
  '3AFSC'?: string
  '4AFSC'?: string
  REASON?: string
  editable?: boolean
}

export interface PascodeInfo {
  srid: string
  senior_rater_name: string
  senior_rater_rank: string
  senior_rater_title: string
  senior_rater_first_name?: string | null
  senior_rater_middle_name?: string | null
  senior_rater_last_name?: string | null
  commander_rank?: string | null
  commander_first_name?: string | null
  commander_middle_name?: string | null
  commander_last_name?: string | null
}

export interface RosterStatistics {
  total_uploaded: number
  total_processed: number
  eligible: number
  ineligible: number
  discrepancy: number
  btz: number
  errors: number
}

export interface RosterCategories {
  eligible: RosterMember[]
  ineligible: RosterMember[]
  discrepancy: RosterMember[]
  btz: RosterMember[]
  small_unit: RosterMember[]
}

export interface RosterPreviewResponse {
  session_id: string
  cycle: string
  year: number
  edited: boolean
  statistics: RosterStatistics
  categories: RosterCategories
  errors: string[]
  pascodes: string[]
  pascode_unit_map: Record<string, string>
  custom_logo: {
    uploaded: boolean
    filename: string | null
  }
  pascode_map?: Record<string, PascodeInfo>
  srid_pascode_map?: Record<string, string[]>
  small_unit_sr?: PascodeInfo | null
  senior_rater_needed?: boolean
}

// Get roster preview for review/editing
export const getRosterPreview = async (
  sessionId: string,
  category: string = 'all',
  page: number = 1,
  pageSize: number = 50
): Promise<RosterPreviewResponse> => {
  const params = { category, page, page_size: pageSize }
  const response = await api.get(`/api/roster/preview/${sessionId}`, { params })
  return response.data
}

// Edit existing member
export const editMember = async (
  sessionId: string,
  memberId: string,
  memberData: Partial<RosterMember>
) => {
  const response = await api.put(`/api/roster/member/${sessionId}/${memberId}`, memberData)
  return response.data
}

// Add new member
export const addMember = async (
  sessionId: string,
  data: {
    category: string
    data: Partial<RosterMember>
    reason: string
    run_eligibility_check: boolean
  }
) => {
  const response = await api.post(`/api/roster/member/${sessionId}`, data)
  return response.data
}

// Delete member
export const deleteMember = async (
  sessionId: string,
  memberId: string,
  reason: string,
  hardDelete: boolean = false
) => {
  const response = await api.delete(`/api/roster/member/${sessionId}/${memberId}`, {
    params: {
      hard_delete: hardDelete,
      reason: reason
    },
  })
  return response.data
}

// Upload custom logo
export const uploadLogo = async (sessionId: string, file: File) => {
  const formData = new FormData()
  formData.append('logo', file)

  const response = await api.post(`/api/roster/logo/${sessionId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

// Get custom logo
export const getLogo = async (sessionId: string) => {
  const response = await api.get(`/api/roster/logo/${sessionId}`, {
    responseType: 'blob',
  })
  return response.data
}

// Delete custom logo
export const deleteLogo = async (sessionId: string) => {
  const response = await api.delete(`/api/roster/logo/${sessionId}`)
  return response.data
}

// Reprocess roster
export const reprocessRoster = async (
  sessionId: string,
  preserveManualEdits: boolean = true,
  categories: string[] = []
) => {
  const response = await api.post(`/api/roster/reprocess/${sessionId}`, {
    preserve_manual_edits: preserveManualEdits,
    categories,
  })
  return response.data
}
