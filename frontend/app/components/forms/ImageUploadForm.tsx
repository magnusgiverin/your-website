import CoordinateSelectorButton from '../CoordinateSelectorButton'

interface ImageUploadFormProps {
  imageFile: File | null
  setImageFile: (file: File | null) => void
  imageCaption: string
  setImageCaption: (caption: string) => void
  imageCoordinates: string | null
  setImageCoordinates: (coords: string | null) => void
  isLoading: boolean
  handleImageSubmit: (e: React.FormEvent) => void
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  setMessage: (msg: string) => void
}

const ImageUploadForm = ({
  imageFile,
  setImageFile,
  imageCaption,
  setImageCaption,
  imageCoordinates,
  setImageCoordinates,
  isLoading,
  handleImageSubmit,
  handleImageChange,
  setMessage,
}: ImageUploadFormProps) => {
  return (
    <form onSubmit={handleImageSubmit} className="flex flex-col gap-4">
      <div className="h-48 flex flex-col">
        <label className="block text-sm font-medium mb-2" style={{color: 'var(--color-text)'}}>
          Select Image
        </label>

        <div
          className="
      flex-1
      border-2 border-dashed rounded-xl
      p-8
      text-center
      transition-all
      hover:border-opacity-60
      cursor-pointer
      flex
      items-center
      justify-center
    "
          style={{borderColor: 'rgba(255, 255, 255, 0.2)'}}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isLoading}
            className="sr-only"
            id="image-input"
          />

          <label htmlFor="image-input" className="cursor-pointer block">
            <span className="material-icons block mb-2" style={{fontSize: '2em'}}>
              add
            </span>
            <p className="text-sm" style={{color: 'var(--color-muted)'}}>
              {imageFile ? imageFile.name : 'Click to upload image'}
            </p>
          </label>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2" style={{color: 'var(--color-text)'}}>
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

      <div>
        <label className="block text-sm font-medium mb-2" style={{color: 'var(--color-text)'}}>
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
        setMessage={setMessage}
      />

      <button
        type="submit"
        disabled={isLoading || !imageFile || !imageCoordinates}
        className="w-full px-6 py-3 rounded-lg font-semibold transition-all mt-6 hover:scale-105 disabled:hover:scale-100"
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
