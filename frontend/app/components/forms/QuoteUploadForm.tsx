import CoordinateSelectorButton from '../CoordinateSelectorButton'

interface QuoteUploadFormProps {
  quoteText: string
  setQuoteText: (text: string) => void
  quoteAuthor: string
  setQuoteAuthor: (author: string) => void
  quoteCoordinates: string | null
  setQuoteCoordinates: (coords: string | null) => void
  isLoading: boolean
  handleQuoteSubmit: (e: React.FormEvent) => void
  setMessage: (msg: string) => void
}

const QuoteUploadForm = ({
  quoteText,
  setQuoteText,
  quoteAuthor,
  setQuoteAuthor,
  quoteCoordinates,
  setQuoteCoordinates,
  isLoading,
  handleQuoteSubmit,
  setMessage,
}: QuoteUploadFormProps) => {
  return (
    <form onSubmit={handleQuoteSubmit} className="flex flex-col gap-4">
      <div className="h-32 md:h-48 flex flex-col">
        <label className="block text-sm font-medium mb-2" style={{color: 'var(--color-text)'}}>
          Thought or Quote
        </label>

        <textarea
          value={quoteText}
          onChange={(e) => setQuoteText(e.target.value)}
          placeholder="What's on your mind?"
          disabled={isLoading}
          className="
      w-full
      flex-1
      h-full
      px-4 py-3
      rounded-xl
      border
      transition-all
      focus:outline-none
      focus:ring-2
      resize-none
    "
          style={{
            backgroundColor: 'var(--color-bg)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            color: 'var(--color-text)',
          }}
        />
      </div>

      <div>
        <label className="hidden sm:block text-sm font-medium mb-2" style={{color: 'var(--color-text)'}}>
          Author (optional)
        </label>
        <input
          type="text"
          value={quoteAuthor}
          onChange={(e) => setQuoteAuthor(e.target.value)}
          placeholder="Who said this?"
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
        <label className="block text-sm font-medium mb-2" style={{color: 'var(--color-text)'}}>
          Location (required for map)
        </label>
        <input
          type="text"
          value={quoteCoordinates ?? ''}
          placeholder="Latitude, Longitude"
          onChange={(e) => setQuoteCoordinates(e.target.value || null)}
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
        setCoordinates={setQuoteCoordinates}
        setMessage={setMessage}
      />

      <button
        type="submit"
        disabled={isLoading || !quoteText.trim() || !quoteCoordinates}
        className="w-full px-8 py-2 rounded-lg font-semibold transition-all mt-6 hover:scale-105 disabled:hover:scale-100"
        style={{
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-bg)',
          opacity: isLoading || !quoteText.trim() || !quoteCoordinates ? 0.5 : 1,
          cursor: isLoading || !quoteText.trim() || !quoteCoordinates ? 'not-allowed' : 'pointer',
        }}
      >
        {isLoading ? 'Uploading…' : 'Share Text'}
      </button>
    </form>
  )
}

export default QuoteUploadForm
