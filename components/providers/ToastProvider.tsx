'use client'

import { Toaster } from 'sonner'

export default function ToastProvider() {
  return (
    <Toaster 
      position="top-right"
      expand={false}
      richColors
      closeButton
      theme="light"
      toastOptions={{
        style: { 
          borderRadius: '1.2rem',
          padding: '1rem',
          fontSize: '0.875rem',
          fontWeight: '600'
        },
      }}
    />
  )
}
