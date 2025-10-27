import { useState, useEffect } from 'react'
import { Modal, Button, Input, Select, type SelectOption } from '@/shared/components/ui'
import { Save } from 'lucide-react'
import { editMember, type RosterMember } from '@/services/rosterApi'

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

interface EditMemberModalProps {
  isOpen: boolean
  member: RosterMember | null
  sessionId: string
  onClose: () => void
  onSave: () => void
}

export function EditMemberModal({ isOpen, member, sessionId, onClose, onSave }: EditMemberModalProps) {
  const [formData, setFormData] = useState<Partial<RosterMember>>({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (member) {
      setFormData({
        FULL_NAME: member.FULL_NAME || '',
        GRADE: member.GRADE || 'SSG',
        DOR: member.DOR || '',
        TAFMSD: member.TAFMSD || '',
        DATE_ARRIVED_STATION: member.DATE_ARRIVED_STATION || '',
        PAFSC: member.PAFSC || '',
        DAFSC: member.DAFSC || '',
        ASSIGNED_PAS: member.ASSIGNED_PAS || '',
        ASSIGNED_PAS_CLEARTEXT: member.ASSIGNED_PAS_CLEARTEXT || '',
        REENL_ELIG_STATUS: member.REENL_ELIG_STATUS || '',
        UIF_CODE: member.UIF_CODE !== undefined ? member.UIF_CODE : 0,
        GRADE_PERM_PROJ: member.GRADE_PERM_PROJ || '',
        UIF_DISPOSITION_DATE: member.UIF_DISPOSITION_DATE || '',
        '2AFSC': member['2AFSC'] || '',
        '3AFSC': member['3AFSC'] || '',
        '4AFSC': member['4AFSC'] || '',
      })
      setError(null)
    }
  }, [member])

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    if (!member) return

    setSaving(true)
    setError(null)

    try {
      await editMember(sessionId, member.member_id, formData)
      onSave()
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to update member')
    } finally {
      setSaving(false)
    }
  }

  if (!member) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Member: ${member.FULL_NAME}`}
      size="xl"
    >
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
              value={formData.FULL_NAME || ''}
              onChange={(e) => handleChange('FULL_NAME', e.target.value)}
              disabled={saving}
              placeholder="LAST, FIRST M"
              required
            />
          </div>

          <Select
            label="Grade"
            value={formData.GRADE || 'SSG'}
            onChange={(e) => handleChange('GRADE', e.target.value)}
            options={GRADES}
            disabled={saving}
            required
          />

          <Input
            label="Primary AFSC"
            value={formData.PAFSC || ''}
            onChange={(e) => handleChange('PAFSC', e.target.value)}
            disabled={saving}
            placeholder="e.g., 3D1X7"
          />

          {/* Dates */}
          <Input
            label="Date of Rank (DOR)"
            value={formData.DOR || ''}
            onChange={(e) => handleChange('DOR', e.target.value)}
            disabled={saving}
            placeholder="DD-MMM-YYYY"
            helperText="Format: 01-JAN-2022"
            required
          />

          <Input
            label="TAFMSD"
            value={formData.TAFMSD || ''}
            onChange={(e) => handleChange('TAFMSD', e.target.value)}
            disabled={saving}
            placeholder="DD-MMM-YYYY"
            helperText="Total Active Service Date"
            required
          />

          <Input
            label="Date Arrived Station (DAS)"
            value={formData.DATE_ARRIVED_STATION || ''}
            onChange={(e) => handleChange('DATE_ARRIVED_STATION', e.target.value)}
            disabled={saving}
            placeholder="DD-MMM-YYYY"
          />

          {/* Unit Info */}
          <Input
            label="PASCODE"
            value={formData.ASSIGNED_PAS || ''}
            onChange={(e) => handleChange('ASSIGNED_PAS', e.target.value)}
            disabled={saving}
            required
          />

          <div className="md:col-span-2">
            <Input
              label="Unit Name"
              value={formData.ASSIGNED_PAS_CLEARTEXT || ''}
              onChange={(e) => handleChange('ASSIGNED_PAS_CLEARTEXT', e.target.value)}
              disabled={saving}
              required
            />
          </div>

          <Input
            label="Desired AFSC (DAFSC)"
            value={formData.DAFSC || ''}
            onChange={(e) => handleChange('DAFSC', e.target.value)}
            disabled={saving}
          />

          <Input
            label="Reenlistment Status"
            value={formData.REENL_ELIG_STATUS || ''}
            onChange={(e) => handleChange('REENL_ELIG_STATUS', e.target.value)}
            disabled={saving}
            placeholder="e.g., 1A"
          />

          <Input
            label="UIF Code"
            type="number"
            value={String(formData.UIF_CODE || 0)}
            onChange={(e) => handleChange('UIF_CODE', parseInt(e.target.value) || 0)}
            disabled={saving}
          />

          <Select
            label="Projected Grade"
            value={formData.GRADE_PERM_PROJ || ''}
            onChange={(e) => handleChange('GRADE_PERM_PROJ', e.target.value)}
            options={[{ value: '', label: 'None' }, ...GRADES]}
            disabled={saving}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            loading={saving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
