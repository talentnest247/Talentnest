"use client"

import { useState } from "react"

interface FileUploadProps {
  title: string
  description: string
  acceptedTypes: string[]
  maxFiles: number
  maxFileSize?: number
  files: File[]
  previews: string[]
  onFilesChange: (files: File[], urls: string[]) => void
  disabled?: boolean
  className?: string
}

export function FileUpload({
  title,
  description,
  acceptedTypes,
  maxFiles,
  maxFileSize = 10,
  files,
  previews,
  onFilesChange,
  disabled = false,
  className = ""
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const validFiles: File[] = []
    const newPreviews: string[] = []

    Array.from(selectedFiles).forEach((file) => {
      if (files.length + validFiles.length >= maxFiles) return
      if (file.size > maxFileSize * 1024 * 1024) return

      const fileType = file.type
      const isValidType = acceptedTypes.some(type => {
        if (type === 'image/*') return fileType.startsWith('image/')
        if (type === 'application/*') return fileType.startsWith('application/')
        return fileType === type
      })

      if (!isValidType) return

      validFiles.push(file)
      
      if (fileType.startsWith('image/')) {
        newPreviews.push(URL.createObjectURL(file))
      } else {
        newPreviews.push('')
      }
    })

    if (validFiles.length > 0) {
      onFilesChange([...files, ...validFiles], [...previews, ...newPreviews])
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (disabled) return
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    const newPreviews = previews.filter((_, i) => i !== index)
    
    if (previews[index]) {
      URL.revokeObjectURL(previews[index])
    }
    
    onFilesChange(newFiles, newPreviews)
  }

  return (
    <div className={className}>
      <h4 className="font-medium text-blue-900 mb-2">{title}</h4>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : disabled 
            ? 'border-gray-200 bg-gray-50' 
            : 'border-gray-300 hover:border-blue-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && document.getElementById(`file-input-${title}`)?.click()}
      >
        <div className="space-y-4">
          <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${
            disabled ? 'bg-gray-200' : 'bg-blue-100'
          }`}>
            <svg className={`w-6 h-6 ${disabled ? 'text-gray-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
          </div>
          
          <div>
            <p className={`font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
              {isDragOver ? 'Drop files here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {acceptedTypes.join(', ')} • Max {maxFileSize}MB • Up to {maxFiles} files
            </p>
          </div>
        </div>
      </div>

      <input
        id={`file-input-${title}`}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
        disabled={disabled}
        aria-label={`Upload ${title}`}
      />

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h5 className="font-medium text-gray-700">Selected Files ({files.length}/{maxFiles})</h5>
          
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-red-100 rounded text-red-600"
                  title="Remove file"
                  aria-label={`Remove ${file.name}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}