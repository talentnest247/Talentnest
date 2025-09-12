'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { X, Upload, File, FileText, Image } from 'lucide-react'
import { toast } from 'sonner'

interface FileUploadProps {
  files: File[]
  onFilesChange: (files: File[]) => void
  maxFiles?: number
  maxSize?: number
  acceptedTypes?: string[]
  disabled?: boolean
}

export function FileUpload({ 
  files, 
  onFilesChange, 
  maxFiles = 5, 
  maxSize = 5 * 1024 * 1024, // 5MB
  acceptedTypes = ['image/*', 'application/pdf'],
  disabled = false
}: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: unknown[]) => {
    if (rejectedFiles.length > 0) {
      toast.error('Some files were rejected. Please check file size and type.')
    }

    if (files.length + acceptedFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`)
      return
    }

    // Check for duplicate files
    const newFiles = acceptedFiles.filter(newFile => 
      !files.some(existingFile => 
        existingFile.name === newFile.name && existingFile.size === newFile.size
      )
    )

    if (newFiles.length !== acceptedFiles.length) {
      toast.warning('Some duplicate files were skipped')
    }

    onFilesChange([...files, ...newFiles])
  }, [files, onFilesChange, maxFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = []
      return acc
    }, {} as Record<string, string[]>),
    maxSize,
    maxFiles: maxFiles - files.length,
    disabled
  })

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    onFilesChange(newFiles)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-4 w-4 text-blue-500" aria-label="Image file" />
    } else if (file.type === 'application/pdf') {
      return <FileText className="h-4 w-4 text-red-500" aria-label="PDF file" />
    }
    return <File className="h-4 w-4 text-gray-500" aria-label="Document file" />
  }

  return (
    <div className="space-y-4">
      <Card
        {...getRootProps()}
        className={`border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-primary bg-primary/5' 
            : disabled 
            ? 'border-muted-foreground/25 bg-muted/20 cursor-not-allowed'
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className={`mx-auto h-8 w-8 mb-2 ${disabled ? 'text-muted-foreground/50' : 'text-muted-foreground'}`} />
        {isDragActive ? (
          <p>Drop the files here...</p>
        ) : (
          <div>
            <p className={disabled ? 'text-muted-foreground/50' : ''}>
              {disabled ? 'File upload disabled' : 'Drag & drop files here, or click to select'}
            </p>
            {!disabled && (
              <div className="text-sm text-muted-foreground mt-1 space-y-1">
                <p>Max {maxFiles} files, {formatFileSize(maxSize)} each</p>
                <p>Supported: {acceptedTypes.join(', ')}</p>
              </div>
            )}
          </div>
        )}
      </Card>

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Uploaded Files ({files.length}/{maxFiles})</h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                <div className="flex items-center space-x-3">
                  {getFileIcon(file)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  disabled={disabled}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
