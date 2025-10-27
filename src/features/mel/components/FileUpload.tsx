import { useState, useRef, type ChangeEvent, type DragEvent } from 'react'
import { Button } from '@/shared/components/ui'
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  accept?: string
  maxSize?: number // in MB
}

export function FileUpload({ onFileSelect, accept = '.csv,.xlsx', maxSize = 10 }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): boolean => {
    // Check file type
    const validTypes = accept.split(',').map(t => t.trim())
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()

    if (!validTypes.includes(fileExtension)) {
      setError(`Invalid file type. Please upload ${accept} files only.`)
      return false
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSize) {
      setError(`File size exceeds ${maxSize}MB limit.`)
      return false
    }

    setError('')
    return true
  }

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file)
      onFileSelect(file)
    }
  }

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleClearFile = () => {
    setSelectedFile(null)
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
          isDragging
            ? 'border-primary bg-primary/5'
            : error
            ? 'border-danger bg-danger/5'
            : selectedFile
            ? 'border-success bg-success/5'
            : 'border-slate-300 hover:border-primary/50'
        }`}
      >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileInput}
            className="hidden"
          />

          {!selectedFile ? (
            <div className="space-y-3">
              <div className="flex justify-center">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div>
                <p className="text-base font-semibold text-slate-900 mb-1">
                  Drop your roster file here
                </p>
                <p className="text-xs text-slate-600 mb-3">
                  or click to browse ({accept} files, max {maxSize}MB)
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  leftIcon={<Upload className="w-4 h-4" />}
                  size="sm"
                >
                  Select File
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-center">
                <div className="p-3 bg-success/10 rounded-full">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <File className="w-5 h-5 text-slate-600" />
                  <p className="font-semibold text-slate-900">{selectedFile.name}</p>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
                <div className="flex justify-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearFile}
                    leftIcon={<X className="w-4 h-4" />}
                  >
                    Remove
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose Different File
                  </Button>
                </div>
              </div>
            </div>
          )}

        {error && (
          <div className="mt-4 flex items-center justify-center space-x-2 text-danger">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
