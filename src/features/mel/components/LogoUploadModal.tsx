import { useState } from 'react'
import { Modal, Button } from '@/shared/components/ui'
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react'
import { uploadLogo, deleteLogo } from '@/services/rosterApi'

interface LogoUploadModalProps {
  isOpen: boolean
  sessionId: string
  currentLogo?: { uploaded: boolean; filename: string | null }
  onClose: () => void
  onUpload: () => void
}

export function LogoUploadModal({ isOpen, sessionId, currentLogo, onClose, onUpload }: LogoUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragActive, setIsDragActive] = useState(false)

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragActive(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      setError('Only PNG and JPG files are allowed')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    setSelectedFile(file)
    setError(null)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload')
      return
    }

    setUploading(true)
    setError(null)

    try {
      await uploadLogo(sessionId, selectedFile)
      setSelectedFile(null)
      setPreview(null)
      onUpload()
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to upload logo')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    setError(null)

    try {
      await deleteLogo(sessionId)
      onUpload()
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to delete logo')
    } finally {
      setDeleting(false)
    }
  }

  const handleClose = () => {
    setSelectedFile(null)
    setPreview(null)
    setError(null)
    onClose()
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Upload Custom Logo" size="md">
      <div className="space-y-6">
        {error && (
          <div className="p-4 bg-danger/10 border border-danger rounded-lg text-danger text-sm">
            {error}
          </div>
        )}

        {/* Current Logo */}
        {currentLogo?.uploaded && (
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ImageIcon className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Current Logo</p>
                  <p className="text-xs text-slate-500">{currentLogo.filename}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={deleting || uploading}
                loading={deleting}
                leftIcon={<Trash2 className="w-4 h-4" />}
              >
                Delete
              </Button>
            </div>
          </div>
        )}

        {/* File Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragActive(true)
          }}
          onDragLeave={() => setIsDragActive(false)}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-slate-300 hover:border-primary hover:bg-slate-50'
          }`}
        >
          <input
            type="file"
            id="logo-upload"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileInput}
            className="hidden"
          />
          <label htmlFor="logo-upload" className="cursor-pointer">
            <Upload className="w-12 h-12 mx-auto text-slate-400 mb-4" />
            <p className="text-sm font-medium text-slate-900 mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-slate-500">PNG or JPG (max 5MB)</p>
          </label>
        </div>

        {/* Preview */}
        {preview && selectedFile && (
          <div className="p-4 bg-slate-50 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-900">Preview</p>
              <button
                onClick={() => {
                  setSelectedFile(null)
                  setPreview(null)
                }}
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                Remove
              </button>
            </div>
            <div className="flex items-center gap-4">
              <img
                src={preview}
                alt="Logo preview"
                className="w-24 h-24 object-contain border border-slate-200 rounded bg-white"
              />
              <div className="flex-1 text-sm">
                <p className="font-medium text-slate-900">{selectedFile.name}</p>
                <p className="text-slate-500">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleClose} disabled={uploading || deleting}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading || deleting}
            loading={uploading}
            leftIcon={<Upload className="w-4 h-4" />}
          >
            {uploading ? 'Uploading...' : 'Upload Logo'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
