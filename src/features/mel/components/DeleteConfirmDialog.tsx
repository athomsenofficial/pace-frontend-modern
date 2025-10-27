import { useState } from 'react'
import { Modal, Button, Input } from '@/shared/components/ui'
import { Trash2, AlertTriangle } from 'lucide-react'
import { deleteMember, type RosterMember } from '@/services/rosterApi'

interface DeleteConfirmDialogProps {
  isOpen: boolean
  member: RosterMember | null
  sessionId: string
  onClose: () => void
  onConfirm: () => void
}

export function DeleteConfirmDialog({ isOpen, member, sessionId, onClose, onConfirm }: DeleteConfirmDialogProps) {
  const [reason, setReason] = useState('')
  const [hardDelete, setHardDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!member) return

    if (!reason) {
      setError('Please provide a reason for deleting this member')
      return
    }

    setDeleting(true)
    setError(null)

    try {
      await deleteMember(sessionId, member.member_id, reason, hardDelete)
      setReason('')
      setHardDelete(false)
      onConfirm()
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to delete member')
    } finally {
      setDeleting(false)
    }
  }

  const handleClose = () => {
    setReason('')
    setHardDelete(false)
    setError(null)
    onClose()
  }

  if (!member) return null

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Delete Member" size="md">
      <div className="space-y-6">
        {/* Warning Message */}
        <div className="flex items-start gap-3 p-4 bg-warning/10 border border-warning rounded-lg">
          <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-warning-dark">Confirm Deletion</h4>
            <p className="text-sm text-slate-700 mt-1">
              Are you sure you want to delete this member? This action will be logged and can be
              audited.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-danger/10 border border-danger rounded-lg text-danger text-sm">
            {error}
          </div>
        )}

        {/* Member Information */}
        <div className="p-4 bg-slate-50 rounded-lg space-y-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-slate-600">Name:</div>
            <div className="font-medium">{member.FULL_NAME}</div>

            <div className="text-slate-600">Grade:</div>
            <div className="font-medium">{member.GRADE}</div>

            <div className="text-slate-600">PASCODE:</div>
            <div className="font-medium">{member.ASSIGNED_PAS}</div>

            <div className="text-slate-600">Unit:</div>
            <div className="font-medium">{member.ASSIGNED_PAS_CLEARTEXT}</div>
          </div>
        </div>

        {/* Reason for Deletion */}
        <Input
          label="Reason for Deletion"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={deleting}
          placeholder="e.g., Duplicate entry, incorrect data, member separated"
          required
        />

        {/* Hard Delete Option */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hardDelete}
              onChange={(e) => setHardDelete(e.target.checked)}
              disabled={deleting}
              className="w-4 h-4 text-danger border-slate-300 rounded focus:ring-danger"
            />
            <span className="text-sm text-slate-700">
              Hard delete (permanently remove from database)
            </span>
          </label>
          <p className="text-xs text-slate-500 mt-1 ml-6">
            {hardDelete
              ? 'This member will be permanently removed and cannot be recovered.'
              : 'This member will be marked as deleted but can be restored if needed.'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleClose} disabled={deleting}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={deleting || !reason}
            loading={deleting}
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            {deleting ? 'Deleting...' : 'Delete Member'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
