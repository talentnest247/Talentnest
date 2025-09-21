"use client"
import type React from "react"

type ThemeProviderProps = {
  children: React.ReactNode
}

// No-op ThemeProvider: theme system removed
export function ThemeProvider({ children }: ThemeProviderProps) {
  return <>{children}</>
}

export const useTheme = () => {
  return {
    theme: "light" as "light" | "dark" | "system",
    setTheme: (_: "dark" | "light" | "system") => {},
  }
}

