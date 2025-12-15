'use client';
import { allUploadsQuery } from '@/sanity/lib/queries'
import { sanityFetch } from '@/sanity/lib/sanityFetch'
import UploadForm from '@/app/components/modals/UploadModal'
import WorldMapWrapper from '@/app/components/WorldMapWrapper'
import { Upload } from './types/Upload'
import InfoForm from './components/modals/InfoModal'
import MoveToUserLocationButton from './components/MoveToUserLocationButton'
import { useEffect, useState } from 'react'

export default async function Page() {
  const [uploads, setUploads] = useState<Upload[]>([])

  const fetchData = async () => {
    const { data } = await sanityFetch<Upload[]>({ query: allUploadsQuery })
    setUploads(data ?? [])
  }

  useEffect(() => {
    fetchData()
  }, [])
  
  const itemsWithLocation =
    uploads.filter((item: Upload) => item.coordinates?.lat && item.coordinates?.lng)

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="h-screen overflow-hidden">
        {itemsWithLocation.length > 0 ? (
          <WorldMapWrapper uploads={uploads} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <p className="mb-2" style={{ color: 'var(--color-muted)' }}>
                No contributions with location yet
              </p>
              <p className="text-sm" style={{ color: 'var(--color-muted)', opacity: 0.6 }}>
                Add your first item to see it on the map
              </p>
            </div>
          </div>
        )}
      </div>
      <InfoForm />
      <UploadForm onComplete={fetchData} />
      <MoveToUserLocationButton />
    </div>
  )
}
