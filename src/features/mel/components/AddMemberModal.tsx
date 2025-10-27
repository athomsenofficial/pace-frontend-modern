import { useState } from 'react'
import { Modal, Button, Input, Select, type SelectOption } from '@/shared/components/ui'
import { Plus } from 'lucide-react'
import { addMember } from '@/services/rosterApi'

const GRADES: SelectOption[] = [
  { value: 'AB', label: 'AB' },
  { value: 'AMN', label: 'AMN' },
  { value: 'A1C', label: 'A1C' },
  { value: 'SRA', label: 'SRA' },
  { value: 'SSG', label: 'SSG' },
  { value: 'TSG', label: 'TSG' },
  { value: 'MSG', label: 'MSG' },
  { value: 'SMS', label: 'SMS' },
  { value: 'CMS', label: 'CMS' },
]

interface AddMemberModalProps {
  isOpen: boolean
  sessionId: string
  cycle?: string
  onClose: () => void
  onSave: () => void
}

export function AddMemberModal({ isOpen, sessionId, cycle, onClose, onSave }: AddMemberModalProps) {
  const [formData, setFormData] = useState({
    FULL_NAME: '',
    GRADE: cycle || 'SSG',
    DOR: '',
    TAFMSD: '',
    DATE_ARRIVED_STATION: '',
    PAFSC: '',
    DAFSC: '',
    ASSIGNED_PAS: '',
    ASSIGNED_PAS_CLEARTEXT: '',
    REENL_ELIG_STATUS: '1A',
    UIF_CODE: 0,
    UIF_DISPOSITION_DATE: '',
  })
  // Category will be auto-determined by the backend based on eligibility checks
  const category = 'eligible' // Default category - backend will reclassify if needed
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Format date from YYYY-MM-DD to DD-MMM-YYYY
  const formatDateToMilitary = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString + 'T00:00:00') // Add time to avoid timezone issues
    const day = String(date.getDate()).padStart(2, '0')
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  // Convert DD-MMM-YYYY to YYYY-MM-DD for input value
  const militaryToInputDate = (militaryDate: string) => {
    if (!militaryDate) return ''
    try {
      const parts = militaryDate.split('-')
      if (parts.length !== 3) return ''
      const day = parts[0]
      const monthName = parts[1]
      const year = parts[2]
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
      const monthIndex = months.indexOf(monthName.toUpperCase())
      if (monthIndex === -1) return ''
      const month = String(monthIndex + 1).padStart(2, '0')
      return `${year}-${month}-${day}`
    } catch {
      return ''
    }
  }

  const handleDateChange = (field: string, value: string) => {
    // Store the formatted date in the state
    const formattedDate = formatDateToMilitary(value)
    handleChange(field, formattedDate)
  }

  const handleReset = () => {
    setFormData({
      FULL_NAME: '',
      GRADE: cycle || 'SSG',
      DOR: '',
      TAFMSD: '',
      DATE_ARRIVED_STATION: '',
      PAFSC: '',
      DAFSC: '',
      ASSIGNED_PAS: '',
      ASSIGNED_PAS_CLEARTEXT: '',
      REENL_ELIG_STATUS: '1A',
      UIF_CODE: 0,
      UIF_DISPOSITION_DATE: '',
    })
    setError(null)
  }

  const handleSave = async () => {
    // Validate required fields
    if (
      !formData.FULL_NAME ||
      !formData.DOR ||
      !formData.TAFMSD ||
      !formData.PAFSC ||
      !formData.ASSIGNED_PAS ||
      !formData.ASSIGNED_PAS_CLEARTEXT
    ) {
      setError('Please fill in all required fields')
      return
    }

    // Validate UIF disposition date if UIF code > 0
    if (formData.UIF_CODE > 0 && !formData.UIF_DISPOSITION_DATE) {
      setError('UIF Disposition Date is required when UIF Code is greater than 0')
      return
    }

    setSaving(true)
    setError(null)

    try {
      await addMember(sessionId, {
        category,
        data: formData,
        reason: 'Member added via UI', // Default reason
        run_eligibility_check: true, // Always run eligibility check
      })

      handleReset()
      onSave()
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to add member')
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    handleReset()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Member" size="xl">
      <div className="space-y-6">
        {error && (
          <div className="p-4 bg-danger/10 border border-danger rounded-lg text-danger text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Info */}
          <div className="md:col-span-2">
            <Input
              label="Full Name"
              value={formData.FULL_NAME}
              onChange={(e) => handleChange('FULL_NAME', e.target.value)}
              disabled={saving}
              placeholder="LAST, FIRST M"
              required
            />
          </div>

          <Select
            label="Grade"
            value={formData.GRADE}
            onChange={(e) => handleChange('GRADE', e.target.value)}
            options={GRADES}
            disabled={saving}
            required
          />

          <Input
            label="Primary AFSC"
            value={formData.PAFSC}
            onChange={(e) => handleChange('PAFSC', e.target.value)}
            disabled={saving}
            placeholder="e.g., 3D1X7"
            required
          />

          <Input
            label="Duty AFSC"
            value={formData.DAFSC}
            onChange={(e) => handleChange('DAFSC', e.target.value)}
            disabled={saving}
            placeholder="e.g., -3F071"
            helperText="Include the dash prefix"
          />

          {/* Dates */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Date of Rank (DOR) *
            </label>
            <input
              type="date"
              value={militaryToInputDate(formData.DOR)}
              onChange={(e) => handleDateChange('DOR', e.target.value)}
              disabled={saving}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              required
            />
            <p className="text-xs text-slate-500 mt-1">Converts to: {formData.DOR || 'DD-MMM-YYYY'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              TAFMSD *
            </label>
            <input
              type="date"
              value={militaryToInputDate(formData.TAFMSD)}
              onChange={(e) => handleDateChange('TAFMSD', e.target.value)}
              disabled={saving}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              required
            />
            <p className="text-xs text-slate-500 mt-1">Total Active Service Date: {formData.TAFMSD || 'DD-MMM-YYYY'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Date Arrived Station (DAS)
            </label>
            <input
              type="date"
              value={militaryToInputDate(formData.DATE_ARRIVED_STATION)}
              onChange={(e) => handleDateChange('DATE_ARRIVED_STATION', e.target.value)}
              disabled={saving}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <p className="text-xs text-slate-500 mt-1">Converts to: {formData.DATE_ARRIVED_STATION || 'DD-MMM-YYYY'}</p>
          </div>

          {/* Unit Info */}
          <Input
            label="PASCODE"
            value={formData.ASSIGNED_PAS}
            onChange={(e) => handleChange('ASSIGNED_PAS', e.target.value)}
            disabled={saving}
            required
          />

          <div className="md:col-span-2">
            <Input
              label="Unit Name"
              value={formData.ASSIGNED_PAS_CLEARTEXT}
              onChange={(e) => handleChange('ASSIGNED_PAS_CLEARTEXT', e.target.value)}
              disabled={saving}
              required
            />
          </div>

          <Input
            label="Reenlistment Status"
            value={formData.REENL_ELIG_STATUS}
            onChange={(e) => handleChange('REENL_ELIG_STATUS', e.target.value)}
            disabled={saving}
            placeholder="e.g., 1A"
          />

          <Input
            label="UIF Code"
            type="number"
            value={String(formData.UIF_CODE)}
            onChange={(e) => handleChange('UIF_CODE', parseInt(e.target.value) || 0)}
            disabled={saving}
          />

          {/* UIF Disposition Date - Only show if UIF Code > 0 */}
          {formData.UIF_CODE > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                UIF Disposition Date *
              </label>
              <input
                type="date"
                value={militaryToInputDate(formData.UIF_DISPOSITION_DATE)}
                onChange={(e) => handleDateChange('UIF_DISPOSITION_DATE', e.target.value)}
                disabled={saving}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                required={formData.UIF_CODE > 0}
              />
              <p className="text-xs text-slate-500 mt-1">Required when UIF Code &gt; 0: {formData.UIF_DISPOSITION_DATE || 'DD-MMM-YYYY'}</p>
            </div>
          )}

        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            loading={saving}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            {saving ? 'Adding...' : 'Add Member'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
