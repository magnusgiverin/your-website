'use client'

import {useEffect, useState} from 'react'

interface ToastProps {
  message: string
  type?: 'success' | 'error'
  duration?: number // ms
  onClose?: () => void
}

export default function Toast({message, type = 'success', duration = 3000, onClose}: ToastProps) {
  const [visible, setVisible] = useState(false) // start hidden
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    // Fly in after mount
    const enterTimer = setTimeout(() => setVisible(true), 50)

    // Start exit timer
    const exitTimer = setTimeout(() => setExiting(true), duration)

    // Call onClose after exit animation
    const removeTimer = setTimeout(() => {
      onClose?.()
    }, duration + 300) // 300ms for exit animation

    return () => {
      clearTimeout(enterTimer)
      clearTimeout(exitTimer)
      clearTimeout(removeTimer)
    }
  }, [duration, onClose])

  return (
    <div
      className={`
        fixed z-50 max-w-xs px-4 py-3 rounded-lg shadow-lg
        ${type === 'success' ? 'bg-teal-100 text-teal-800' : 'bg-red-100 text-red-700'}
        right-4 md:top-4
        bottom-4 md:bottom-auto
        transition-transform duration-300
        ${visible && !exiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      {message}
    </div>
  )
}
