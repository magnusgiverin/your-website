'use client'

import {useState} from 'react'

export default function InfoModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="cursor-pointer material-icons fixed bottom-28 right-4 md:right-8 z-40 h-14 w-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all"
        style={{backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)'}}
      >
        question_mark
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            style={{backgroundColor: 'rgba(0, 0, 0, 0.8)'}}
          />

          <div
            className="relative w-full max-w-lg rounded-2xl p-8 shadow-2xl border"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 p-1 hover:opacity-70 transition-opacity material-icons"
              style={{
                color: 'var(--color-muted)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              close
            </button>
            <div className="flex flex-col">
              <h3>Information</h3>
              <span className="mb-4">What exactly is going on here?</span>
              <span className="mb-8" style={{color: 'var(--color-text)'}}>
                This platform is extremely simple. You share images or thoughts tied to specific
                locations on the map.
              </span>
              <div className="flex flex-row gap-4 mb-4">
                <span className="material-icons text-xs">info</span>
                <span className="text-xs">
                  Location of uploads is not accurate for security reasons.
                </span>
              </div>
              <div className="flex flex-row gap-4 mb-4">
                <span className="material-icons text-xs">info</span>
                <span className="text-xs">
                  All uploads are totally anonimised. Only location of uploads is stored for the
                  map.
                </span>
              </div>
              <div className="flex flex-row gap-4 mb-4">
                <span className="material-icons text-xs">warning</span>
                <span className="text-xs">
                  Do not upload sensitive information to this site. We do not take responsibility
                  for any data shared.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
