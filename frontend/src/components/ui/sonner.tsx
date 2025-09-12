"use client"

import type React from "react"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      position="bottom-center"
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "rgba(23, 23, 23, 0.85)",
          "--normal-text": "rgb(245, 245, 245)",
          "--normal-border": "rgba(115, 115, 115, 0.3)",
          "--success-bg": "rgba(34, 197, 94, 0.15)",
          "--success-text": "rgb(34, 197, 94)",
          "--error-bg": "rgba(239, 68, 68, 0.15)",
          "--error-text": "rgb(239, 68, 68)",
          "--warning-bg": "rgba(245, 158, 11, 0.15)",
          "--warning-text": "rgb(245, 158, 11)",
          "--info-bg": "rgba(59, 130, 246, 0.15)",
          "--info-text": "rgb(59, 130, 246)",
        } as React.CSSProperties
      }
      toastOptions={{
        style: {
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(115, 115, 115, 0.2)",
          borderRadius: "12px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
