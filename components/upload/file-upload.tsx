"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { X, Upload, FileText, Camera } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  accept?: string
  multiple?: boolean
  maxFiles?: number
  maxSize?: number // in MB
  onUpload: (files: string[]) => void
  onRemove: (file: string) => void
  uploadedFiles: string[]
  label: string
  description?: string
  type: "portfolio" | "certificate" | "document"
}

export function FileUpload({
  accept = "image/*",
  multiple = true,
  maxFiles = 5,
  maxSize = 5,
  onUpload,
  onRemove,
  uploadedFiles,
  label,
  description,
  type
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const getIcon = () => {
    switch (type) {
      case "portfolio":
        return <Camera className="h-8 w-8 text-blue-500" />
      case "certificate":
        return <FileText className="h-8 w-8 text-blue-500" />
      default:
        return <Upload className="h-8 w-8 text-blue-500" />
    }
  }

  const handleFiles = useCallback(async (files: File[]) => {
    if (uploadedFiles.length + files.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`)
      return
    }

    const validFiles = files.filter(file => {
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    setIsUploading(true)

    try {
      // Simulate file upload - replace with actual upload logic
      const urls = validFiles.map(file => {
        // In a real app, you would upload to Supabase Storage or similar
        return URL.createObjectURL(file)
      })

      onUpload(urls)
    } catch (error) {
      console.error("Upload failed:", error)
      alert("Upload failed. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }, [maxFiles, maxSize, onUpload, uploadedFiles])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files)
      handleFiles(files)
    },
    [handleFiles]
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFiles(files)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-white text-sm font-medium">{label}</Label>
        {description && (
          <p className="text-white/80 text-xs mt-1">{description}</p>
        )}
      </div>

      {/* Upload Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          isDragging
            ? "border-white bg-blue-700"
            : "border-blue-300 hover:border-white hover:bg-blue-700",
          isUploading && "opacity-50 pointer-events-none"
        )}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-3">
          {getIcon()}
          <div className="space-y-1">
            <p className="text-sm font-medium text-white">
              {isUploading ? "Uploading..." : `Drag & drop ${type} files here`}
            </p>
            <p className="text-xs text-white/80">
              or{" "}
              <label className="text-white underline cursor-pointer hover:text-blue-100">
                browse files
                <input
                  type="file"
                  accept={accept}
                  multiple={multiple}
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </p>
          </div>
          <p className="text-xs text-white/60">
            Max {maxFiles} files, {maxSize}MB each
          </p>
        </div>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-white">
            Uploaded Files ({uploadedFiles.length}/{maxFiles})
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="relative group bg-white rounded-lg p-2 border border-blue-200"
              >
                {type === "portfolio" ? (
                  <div className="aspect-video bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                    <Image
                      src={file}
                      alt={`Portfolio ${index + 1}`}
                      width={200}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 rounded flex items-center justify-center">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onRemove(file)}
                >
                  <X className="h-3 w-3" />
                </Button>
                <p className="text-xs text-gray-600 mt-1 truncate">
                  {type} {index + 1}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}