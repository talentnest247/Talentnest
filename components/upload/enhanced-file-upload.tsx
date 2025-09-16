"use client"

import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { X, Upload, File } from 'lucide-react'

interface FileUploadProps {
  onFilesChange: (files: string[]) => void
  accept?: string
  multiple?: boolean
  maxFiles?: number
  label?: string
  description?: string
}

export function FileUpload({
  onFilesChange,
  accept = "*/*",
  multiple = true,
  maxFiles = 5,
  label = "Upload Files",
  description = "Drag and drop files here or click to browse"
}: FileUploadProps) {
  const [files, setFiles] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = useCallback((newFiles: File[]) => {
    const fileUrls = newFiles.map(file => URL.createObjectURL(file))
    const updatedFiles = multiple ? [...files, ...fileUrls].slice(0, maxFiles) : fileUrls.slice(0, 1)
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
  }, [files, multiple, maxFiles, onFilesChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFileChange(droppedFiles)
  }, [handleFileChange])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
  }

  return (
    <div className="space-y-4">
      <Card
        className={`border-dashed border-2 p-6 text-center transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        <h3 className="text-sm font-medium mb-1">{label}</h3>
        <p className="text-xs text-muted-foreground mb-4">{description}</p>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = accept
            input.multiple = multiple
            input.onchange = (e) => {
              const target = e.target as HTMLInputElement
              if (target.files) {
                handleFileChange(Array.from(target.files))
              }
            }
            input.click()
          }}
        >
          Choose Files
        </Button>
      </Card>

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploaded Files</h4>
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
              <div className="flex items-center space-x-2">
                <File className="h-4 w-4" />
                <span className="text-sm truncate">File {index + 1}</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}