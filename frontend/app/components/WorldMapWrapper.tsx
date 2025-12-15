'use client'

import dynamic from 'next/dynamic'
import {Suspense} from 'react'
import {Upload} from '../types/Upload'

const WorldMap = dynamic(() => import('@/app/components/WorldMap'), {
  ssr: false,
  loading: () => (
    <div className="map-container flex-center">
      <div className="text-secondary">Loading map...</div>
    </div>
  ),
})

export default function WorldMapWrapper({uploads}: {uploads: Upload[]}) {
  return (
    <Suspense fallback={<div className="text-secondary">Loading map...</div>}>
      <WorldMap uploads={uploads} />
    </Suspense>
  )
}
