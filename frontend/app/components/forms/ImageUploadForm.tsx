import CoordinateSelectorButton from '../CoordinateSelectorButton'

interface ImageUploadFormProps {
  imageFile: File | null
  imageCaption: string
  setImageCaption: (caption: string) => void
  imageCoordinates: string | null
  setImageCoordinates: (coords: string | null) => void
  isLoading: boolean
  handleImageSubmit: (e: React.FormEvent) => void
  setImageFile: (file: File | null) => void
  showMessage: (msg: string, type?: 'success' | 'error') => void
}

const ImageUploadForm = ({
  imageFile,
  imageCaption,
  setImageCaption,
  imageCoordinates,
  setImageCoordinates,
  isLoading,
  handleImageSubmit,
  setImageFile,
  showMessage,
}: ImageUploadFormProps) => {
  return (
    <form onSubmit={handleImageSubmit} className="flex flex-col gap-4">
      <div className="h-32 md:h-48 flex flex-col">
        <label className="hidden sm:block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
          Select Image
        </label>

        <div
          className="
    flex-1
    border-2 border-dashed rounded-xl
    p-2
    text-center
    transition-all
    hover:border-opacity-60
    cursor-pointer
    flex
    flex-col
    items-center
    justify-center
  "
          style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
        >
          <input
            type="file"
            accept="image/*"
            id="image-input"
            onChange={(e) => {
              if (e.target.files?.[0]) setImageFile(e.target.files[0])
            }}
            disabled={isLoading}
            className="sr-only"
          />

          <label htmlFor="image-input" className="cursor-pointer block w-full h-full">
            {imageFile ? (
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                className="h-28 md:h-36 w-full object-cover rounded-lg"
              />
            ) : (
              <div className='flex flex-col h-full items-center justify-center'>
                <span className="material-icons block mb-2" style={{ fontSize: '2em' }}>
                  add
                </span>
                <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                  Click to upload image
                </p>
              </div>
            )}
          </label>
        </div>
      </div>
      <div>
        <label className="hidden sm:block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
          Caption
        </label>
        <input
          type="text"
          value={imageCaption}
          onChange={(e) => setImageCaption(e.target.value)}
          placeholder="What's in this image?"
          disabled={isLoading}
          className="w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2"
          style={{
            backgroundColor: 'var(--color-bg)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            color: 'var(--color-text)',
          }}
        />
      </div>

      <div className='hidden sm:block'>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
          Location (required for map)
        </label>
        <input
          type="text"
          value={imageCoordinates ?? ''}
          placeholder="Latitude, Longitude"
          onChange={(e) => setImageCoordinates(e.target.value || null)}
          disabled
          className="w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2"
          style={{
            backgroundColor: 'var(--color-bg)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            color: 'var(--color-text)',
          }}
        />
      </div>
      <CoordinateSelectorButton
        isLoading={isLoading}
        setCoordinates={setImageCoordinates}
        showMessage={showMessage}
      />
      <button
        type="submit"
        disabled={isLoading || !imageFile || !imageCoordinates}
        className="w-full px-8 py-2 rounded-lg font-semibold transition-all mt-6 hover:scale-105 disabled:hover:scale-100"
        style={{
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-bg)',
          opacity: isLoading || !imageFile || !imageCoordinates ? 0.5 : 1,
          cursor: isLoading || !imageFile ? 'not-allowed' : 'pointer',
        }}
      >
        {isLoading ? 'Uploading…' : 'Share Image'}
      </button>
    </form>
  )
}

export default ImageUploadForm
