import {allUploadsQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/sanityFetch'
import UploadForm from '@/app/components/modals/UploadModal'
import WorldMapWrapper from '@/app/components/WorldMapWrapper'
import {Upload} from './types/Upload'
import InfoForm from './components/modals/InfoModal'
import MoveToUserLocationButton from './components/MoveToUserLocationButton'

export default async function Page() {
  const fetchData = async () => {
    return sanityFetch<Upload[]>({
      query: allUploadsQuery,
    })
  }
  
  const {data} = await fetchData()
  const uploads = data ?? []

  const itemsWithLocation =
    uploads.filter((item: Upload) => item.coordinates?.lat && item.coordinates?.lng)

  return (
    <div className="min-h-screen" style={{backgroundColor: 'var(--color-bg)'}}>
      <div className="h-screen overflow-hidden">
        <WorldMapWrapper uploads={uploads} />
      </div>
      <InfoForm />
      <UploadForm />
      <MoveToUserLocationButton />
    </div>
  )
}
