'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { X, Upload, File, FileText, Image, CheckCircle, AlertCircle } from 'lucide-react'
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

    if (newFiles.length > 0) {
      onFilesChange([...files, ...newFiles])
      toast.success(`${newFiles.length} file(s) added successfully`)
    }
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
    toast.success('File removed')
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

  const getFileTypeDescription = (file: File) => {
    if (file.type.startsWith('image/')) {
      return 'Image'
    } else if (file.type === 'application/pdf') {
      return 'PDF Document'
    } else if (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return 'Word Document'
    }
    return 'Document'
  }

  const validateFile = (file: File) => {
    const errors: string[] = []
    
    if (file.size > maxSize) {
      errors.push(`File size exceeds ${formatFileSize(maxSize)}`)
    }
    
    const allowedMimes = acceptedTypes.some(type => {
      if (type.includes('*')) {
        const baseType = type.split('/')[0]
        return file.type.startsWith(baseType)
      }
      return file.type === type
    })
    
    if (!allowedMimes) {
      errors.push('File type not supported')
    }
    
    return errors
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card
        {...getRootProps()}
        className={`border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-200 ${
          isDragActive 
            ? 'border-primary bg-primary/5 scale-[1.02]' 
            : disabled 
            ? 'border-muted-foreground/25 bg-muted/20 cursor-not-allowed'
            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-2">
          <Upload className={`h-8 w-8 mb-2 ${
            disabled ? 'text-muted-foreground/50' : 
            isDragActive ? 'text-primary' : 'text-muted-foreground'
          }`} />
          {isDragActive ? (
            <p className="text-primary font-medium">Drop the files here...</p>
          ) : (
            <div className="space-y-1">
              <p className={`font-medium ${disabled ? 'text-muted-foreground/50' : ''}`}>
                {disabled ? 'File upload disabled' : 'Drag & drop files here, or click to select'}
              </p>
              {!disabled && (
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Max {maxFiles} files, {formatFileSize(maxSize)} each</p>
                  <p>Supported: {acceptedTypes.join(', ')}</p>
                  <p className="text-xs">Upload documents like business certificates, ID cards, portfolios, etc.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Files List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Uploaded Files ({files.length}/{maxFiles})</h4>
            {files.length === maxFiles && (
              <span className="text-xs text-muted-foreground">Maximum files reached</span>
            )}
          </div>
          
          <div className="space-y-2">
            {files.map((file, index) => {
              const errors = validateFile(file)
              const hasErrors = errors.length > 0
              
              return (
                <div key={`${file.name}-${index}`} className={`
                  flex items-center justify-between p-3 border rounded-lg transition-colors
                  ${hasErrors ? 'border-red-200 bg-red-50' : 'border-border bg-muted/20'}
                `}>
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {getFileIcon(file)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        {hasErrors ? (
                          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{formatFileSize(file.size)}</span>
                        <span>•</span>
                        <span>{getFileTypeDescription(file)}</span>
                      </div>
                      {hasErrors && (
                        <div className="text-xs text-red-600 mt-1">
                          {errors.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    disabled={disabled}
                    className="flex-shrink-0 hover:bg-red-100 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}
          </div>
          
          {/* Upload Summary */}
          <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
            <div className="flex justify-between">
              <span>Total files: {files.length}</span>
              <span>Total size: {formatFileSize(files.reduce((sum, file) => sum + file.size, 0))}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
