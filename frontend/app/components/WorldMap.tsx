'use client'

import {MapContainer, TileLayer, Marker, Popup, useMap} from 'react-leaflet'
import L from 'leaflet'
import Image from 'next/image'
import 'leaflet/dist/leaflet.css'
import {useEffect, useState} from 'react'
import {Upload} from '../types/Upload'

const WORLD_BOUNDS: [[number, number], [number, number]] = [
  [-85, -180],
  [85, 180],
]

interface WorldMapProps {
  uploads: Upload[]
}

function MapController({userLocation}: {userLocation: [number, number] | null}) {
  const map = useMap()

  useEffect(() => {
    map.setMaxBounds(WORLD_BOUNDS)

    const minZoom = map.getBoundsZoom(WORLD_BOUNDS, true)
    map.setMinZoom(minZoom)
  }, [map])

  useEffect(() => {
    if (userLocation) {
      map.flyTo(userLocation, 16, {duration: 1.2})
    }
  }, [userLocation, map])

  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<{lat: number; lng: number}>
      const {lat, lng} = customEvent.detail

      map.flyTo([lat, lng], 12, {
        duration: 1.2,
        easeLinearity: 0.25,
      })
    }

    window.addEventListener('moveToLocation', handler)

    return () => {
      window.removeEventListener('moveToLocation', handler)
    }
  }, [map])

  return null
}

export default function WorldMap({uploads}: WorldMapProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const uploadsWithLocation = uploads.filter((u) => u.coordinates?.lat && u.coordinates?.lng)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          console.log('Location access denied or unavailable:', error)
        },
      )
    }
  }, [])

  const createCustomIcon = () => {
    return L.divIcon({
      className: 'custom-marker',
      html: `
      <div
        style="
          width: 32px;
          height: 32px;
          border-radius: 9999px;
          background: var(--color-surface);
          border: 2px solid var(--color-primary);
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
        "
      >
        <div
          style="
            width: 12px;
            height: 12px;
            border-radius: 9999px;
            background: var(--color-text);
          "
        ></div>
      </div>
    `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    })
  }

  const createUserIcon = () => {
    return L.divIcon({
      className: 'user-marker',
      html: `
      <div
        style="
          position: relative;
          width: 48px;
          height: 48px;
        "
      >
        <!-- Ping ring -->
        <div
          style="
            position: absolute;
            inset: 0;
            border-radius: 9999px;
            background: var(--color-secondary);
            opacity: 0.25;
            animation: user-ping 2s ease-out infinite;
          "
        ></div>

        <!-- Core marker -->
        <div
          style="
            position: relative;
            width: 48px;
            height: 48px;
            border-radius: 9999px;
            background: var(--color-surface);
            border: 4px solid var(--color-secondary);
            box-shadow: 0 8px 20px rgba(0,0,0,0.45);
            display: flex;
            align-items: center;
            justify-content: center;
          "
        >
          <div
            style="
              width: 10px;
              height: 10px;
              border-radius: 9999px;
              background: var(--color-secondary);
            "
          ></div>
        </div>
      </div>
    `,
      iconSize: [48, 48],
      iconAnchor: [24, 24],
      popupAnchor: [0, -24],
    })
  }

  return (
    <>
      <style jsx global>{`
        .leaflet-bottom.leaflet-right,
        .leaflet-top.leaflet-left {
          display: none !important;
        }
      `}</style>
      <MapContainer
        center={userLocation || [20, 0]}
        zoom={userLocation ? 12 : 3}
        maxZoom={18}
        maxBounds={WORLD_BOUNDS}
        maxBoundsViscosity={1.0}
        worldCopyJump={false}
        className="h-full w-full z-10"
        scrollWheelZoom
        attributionControl={false}
        zoomControl={false}
      >
        <MapController userLocation={userLocation} />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap &copy; CARTO"
          noWrap={true}
          bounds={WORLD_BOUNDS}
        />

        {/* User location marker */}
        {userLocation && (
          <Marker position={userLocation} icon={createUserIcon()}>
            <Popup>
              <div className="text-center">
                <span>Your current location</span>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Upload markers */}
        {uploadsWithLocation.map((upload) => (
          <Marker
            key={upload._id}
            position={[upload.coordinates!.lat, upload.coordinates!.lng]}
            icon={createCustomIcon()}
          >
            <Popup maxWidth={1000}>
              <div style={{width: '24rem'}}>
                {upload._type === 'imageUpload' && upload.imageUrl ? (
                  <div className="flex flex-col gap-2">
                    <div
                      className="relative w-full overflow-hidden rounded-lg border"
                      style={{
                        aspectRatio: upload.asset?.metadata.dimensions.aspectRatio ?? 'auto',
                        borderColor: 'var(--color-muted)',
                        maxWidth: '100%',
                      }}
                    >
                      <Image
                        src={upload.imageUrl}
                        alt={upload.caption || 'Shared image'}
                        fill
                        sizes="300px"
                        style={{objectFit: 'contain'}}
                      />
                    </div>

                    {upload.caption && <span>{upload.caption}</span>}
                  </div>
                ) : upload._type === 'quote' ? (
                  <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-2)'}}>
                    <p style={{fontStyle: 'italic', color: 'var(--color-muted)'}}>
                      "{upload.text}"
                    </p>
                    {upload.author && <p className="text-xs">— {upload.author}</p>}
                  </div>
                ) : null}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  )
}
