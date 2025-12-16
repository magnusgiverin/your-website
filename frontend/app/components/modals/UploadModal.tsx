'use client'

import { useState } from 'react'
import QuoteUploadForm from '../forms/QuoteUploadForm'
import ImageUploadForm from '../forms/ImageUploadForm'
import Toast from '../Toast'

export default function UploadModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadType, setUploadType] = useState<'image' | 'quote'>('image')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageCaption, setImageCaption] = useState('')
  const [imageCoordinates, setImageCoordinates] = useState<null | string>(null)

  const [quoteText, setQuoteText] = useState('')
  const [quoteAuthor, setQuoteAuthor] = useState('')
  const [quoteCoordinates, setQuoteCoordinates] = useState<null | string>(null)

  const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ message: msg, type })
    if (type === 'success') setIsOpen(false)
  }

  const getRecaptchaToken = async () => {
    if (!(window as any).grecaptcha) {
      throw new Error('reCAPTCHA not loaded')
    }

    return await (window as any).grecaptcha.execute(
      process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
      { action: 'upload' }
    )
  }

  const handleChangeUploadType = (type: 'image' | 'quote') => {
    setUploadType(type)

    setImageFile(null)
    setImageCaption('')
    setImageCoordinates(null)

    setQuoteText('')
    setQuoteAuthor('')
    setQuoteCoordinates(null)
  }

  const parseCoordinates = (value: string | null) => {
    if (!value) return null

    const [latStr, lngStr] = value.split(',').map((s) => s.trim())
    const lat = Number(latStr)
    const lng = Number(lngStr)

    if (Number.isNaN(lat) || Number.isNaN(lng)) return null

    return {
      _type: 'geopoint',
      lat: lat,
      lng: lng,
    }
  }

  const handleImageSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!imageFile) return showMessage('Please select an image', 'error')

    setIsLoading(true)

    try {
      const token = await getRecaptchaToken()

      const formData = new FormData()
      formData.append('file', imageFile)
      formData.append('caption', imageCaption)
      formData.append('recaptcha', token)

      if (imageCoordinates) {
        formData.append('coordinates', JSON.stringify(parseCoordinates(imageCoordinates)))
      }

      const res = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error()

      showMessage('Image uploaded successfully!', 'success')
      setImageFile(null)
      setImageCaption('')
    } catch {
      showMessage('Error uploading image. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!quoteText.trim()) return showMessage('Please enter a quote', 'error')

    setIsLoading(true)

    try {
      const token = await getRecaptchaToken()
      
      const res = await fetch('/api/upload/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: quoteText,
          author: quoteAuthor,
          coordinates: quoteCoordinates
            ? parseCoordinates(quoteCoordinates)
            : null,
          recaptcha: token,
        }),
      })

      if (!res.ok) throw new Error()

      showMessage('Quote uploaded successfully!', 'success')
      setQuoteText('')
      setQuoteAuthor('')
      setQuoteCoordinates(null)
    } catch {
      showMessage('Error uploading quote. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="cursor-pointer material-icons fixed bottom-8 right-4 md:right-8 z-40 h-14 w-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all"
        style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)' }}
      >
        add
      </button>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4">
          <div
            className="absolute inset-0 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
          />

          <div
            className="
    relative
    w-full max-w-lg lg:max-w-7xl xl:max-w-lg
    max-h-[90vh]
    rounded-2xl
    shadow-2xl
    border
    flex
    flex-col
  "
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <div className="relative p-4 md:p-8 shrink-0">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 p-1 hover:opacity-70 transition-opacity material-icons"
                style={{ color: 'var(--color-muted)' }}
              >
                close
              </button>

              <h3>Add to Board</h3>
              <p className="mb-6" style={{ color: 'var(--color-muted)' }}>
                Share with the world from your location
              </p>

              <div className="mb-8">
                <label className="block text-sm font-semibold mb-3">
                  What type?
                </label>
                <div className="flex gap-4">
                  {(['image', 'quote'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleChangeUploadType(type)}
                      className="cursor-pointer flex-1 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: uploadType === type ? 'var(--color-primary)' : 'transparent',
                        color: uploadType === type ? 'var(--color-bg)' : 'var(--color-text)',
                        border: uploadType === type ? 'none' : '1px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      <span className="material-icons">
                        {type === 'image' ? 'camera_alt' : 'format_quote'}
                      </span>
                      {type === 'image' ? 'Image' : 'Text'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div
              className="
    relative
    flex-1
    overflow-y-auto
    px-4 md:px-8
    pb-8
  "
            >

              {uploadType === 'image' && (
                <ImageUploadForm
                  isLoading={isLoading}
                  imageFile={imageFile}
                  setImageFile={setImageFile}
                  imageCaption={imageCaption}
                  setImageCaption={setImageCaption}
                  imageCoordinates={imageCoordinates}
                  setImageCoordinates={setImageCoordinates}
                  handleImageSubmit={handleImageSubmit}
                  showMessage={showMessage}
                />
              )}

              {uploadType === 'quote' && (
                <QuoteUploadForm
                  isLoading={isLoading}
                  quoteText={quoteText}
                  setQuoteText={setQuoteText}
                  quoteAuthor={quoteAuthor}
                  setQuoteAuthor={setQuoteAuthor}
                  quoteCoordinates={quoteCoordinates}
                  setQuoteCoordinates={setQuoteCoordinates}
                  handleQuoteSubmit={handleQuoteSubmit}
                  showMessage={showMessage}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
