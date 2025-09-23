"use client"

import * as React from "react"
import { useToast, type ToasterToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, open, onOpenChange, variant }: ToasterToast) {
        const ToastEl = Toast as unknown as React.ComponentType<ToasterToast & { children?: React.ReactNode }>
        const content = (
          <>
            <div className="grid gap-1">
              {title && <ToastTitle>{title as React.ReactNode}</ToastTitle>}
              {description && (
                <ToastDescription>{description as React.ReactNode}</ToastDescription>
              )}
            </div>
            {action as React.ReactNode}
            <ToastClose />
          </>
        )

        return (
          <ToastEl key={id} id={id} open={open} onOpenChange={onOpenChange} variant={variant}>
            {content}
          </ToastEl>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
