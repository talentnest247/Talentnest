"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { X, Upload, FileText, Image as ImageIcon, CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onUpload: (urls: string[]) => void
  onRemove: (url: string) => void
  uploadedFiles: string[]
  maxFiles?: number
  acceptedTypes?: string[]
  label: string
  description?: string
  required?: boolean
  className?: string
}

interface UploadProgress {
  [key: string]: number
}

export function FileUpload({
  onUpload,
  onRemove,
  uploadedFiles,
  maxFiles = 3,
  acceptedTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"],
  label,
  description,
  required = false,
  className
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({})
  const [error, setError] = useState<string>("")

  const handleFileUpload = useCallback(async (files: FileList) => {
    setError("")
    
    if (uploadedFiles.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`)
      return
    }

    setUploading(true)
    const newUploadedUrls: string[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileId = `${file.name}_${Date.now()}`
        
        // Validate file type
        if (!acceptedTypes.includes(file.type)) {
          setError(`Invalid file type for ${file.name}. Please upload PDF or image files.`)
          continue
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
          setError(`File ${file.name} is too large. Maximum size is 5MB.`)
          continue
        }

        const formData = new FormData()
        formData.append("file", file)
        formData.append("folder", "certificates")
        formData.append("userId", crypto.randomUUID()) // Generate a unique ID for now

        // Simulate progress
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }))
        
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const current = prev[fileId] || 0
            if (current >= 90) {
              clearInterval(progressInterval)
              return prev
            }
            return { ...prev, [fileId]: current + 10 }
          })
        }, 100)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        clearInterval(progressInterval)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Upload failed")
        }

        const result = await response.json()
        newUploadedUrls.push(result.url)
        
        setUploadProgress(prev => ({ ...prev, [fileId]: 100 }))
        
        // Remove progress after a delay
        setTimeout(() => {
          setUploadProgress(prev => {
            const newProgress = { ...prev }
            delete newProgress[fileId]
            return newProgress
          })
        }, 1000)
      }

      if (newUploadedUrls.length > 0) {
        onUpload(newUploadedUrls)
      }
    } catch (error) {
      console.error("Upload error:", error)
      setError(error instanceof Error ? error.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }, [uploadedFiles.length, maxFiles, acceptedTypes, onUpload])

  const handleRemoveFile = useCallback(async (url: string) => {
    try {
      // Extract file path from URL for deletion
      const urlParts = url.split('/')
      const filePath = urlParts.slice(-2).join('/') // Get folder/filename

      await fetch(`/api/upload?filePath=${encodeURIComponent(filePath)}`, {
        method: "DELETE",
      })

      onRemove(url)
    } catch (error) {
      console.error("Delete error:", error)
      setError("Failed to delete file")
    }
  }, [onRemove])

  const getFileIcon = (url: string) => {
    if (url.includes('.pdf')) {
      return <FileText className="h-4 w-4 text-red-500" />
    }
    return <ImageIcon className="h-4 w-4 text-blue-500" />
  }

  const getFileName = (url: string) => {
    return url.split('/').pop() || 'Unknown file'
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <Label htmlFor={`upload-${label}`}>
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Upload Area */}
      <Card className="border-dashed border-2 border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm font-medium">
                Drop files here or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, JPG, PNG, WEBP up to 5MB each (max {maxFiles} files)
              </p>
            </div>
            <Input
              id={`upload-${label}`}
              type="file"
              multiple
              accept={acceptedTypes.join(",")}
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              disabled={uploading || uploadedFiles.length >= maxFiles}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Uploading...</span>
                <span className="text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Uploaded Files</Label>
          <div className="grid gap-2">
            {uploadedFiles.map((url, index) => (
              <Card key={index} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getFileIcon(url)}
                    <span className="text-sm font-medium truncate max-w-[200px]">
                      {getFileName(url)}
                    </span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFile(url)}
                    className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {uploadedFiles.length >= maxFiles && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Maximum number of files reached ({maxFiles}). Remove a file to upload another.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
