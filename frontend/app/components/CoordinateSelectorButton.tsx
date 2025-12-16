import { useEffect, useState } from 'react'

interface CoordinateSelectorButtonProps {
  isLoading: boolean
  showMessage: (msg: string, type?: 'success' | 'error') => void
  setCoordinates: (coords: string | null) => void
}

const metersToLatLngOffset = (meters: number, lat: number) => {
  const earthRadiusMeters = 111320

  const latOffset = meters / earthRadiusMeters
  const lngOffset = meters / (earthRadiusMeters * Math.cos((lat * Math.PI) / 180))

  const angle = Math.random() * 2 * Math.PI
  const radius = Math.random()

  return {
    lat: latOffset * radius * Math.cos(angle),
    lng: lngOffset * radius * Math.sin(angle),
  }
}

const CoordinateSelectorButton = ({
  isLoading,
  showMessage,
  setCoordinates,
}: CoordinateSelectorButtonProps) => {
  const [jitterMeters, setJitterMeters] = useState(100)
  const [ownLocationUsed, setOwnLocationUsed] = useState(false)

  // 🔹 Store exact user location once
  const [baseLocation, setBaseLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)

  const applyJitter = (base: { lat: number; lng: number }) => {
    let lat = base.lat
    let lng = base.lng

    if (jitterMeters > 0) {
      const offset = metersToLatLngOffset(jitterMeters, lat)
      lat += offset.lat
      lng += offset.lng
    }

    setCoordinates(`${lat.toFixed(6)}, ${lng.toFixed(6)}`)
  }

  const getUserLocation = async () => {
    if (!navigator.geolocation) {
      showMessage('Geolocation is not supported by your browser', 'error')
      return
    }

    try {
      const status = await navigator.permissions.query({ name: 'geolocation' })

      if (status.state === 'denied') {
        showMessage(
          'Location access was denied. Please enable it in your browser settings.',
          'error'
        )
        return
      }
    } catch {
      // Permissions API not supported, fallback to trying geolocation
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const base = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setBaseLocation(base)
        applyJitter(base)
        setOwnLocationUsed(true)
      },
      (error) => {
        if (error.code === 1) {
          // Permission denied
          showMessage(
            'Location access was denied. Please allow it in your browser to use this feature.',
            'error'
          )
        } else {
          showMessage('Unable to retrieve your location', 'error')
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    )
  }

  // 🔹 Re-apply jitter when slider changes
  useEffect(() => {
    if (baseLocation) {
      applyJitter(baseLocation)
    }
  }, [jitterMeters]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col lg:flex-row xl:flex-col gap-4 mt-2 md:mt-4 lg:justify-between xl:justify-center">
      {/* Button */}
      <button
        type="button"
        onClick={() => {
          getUserLocation()
        }}
        disabled={isLoading}
        className="w-full cursor-pointer flex items-center justify-center gap-3 group"
        style={{ color: 'var(--color-primary)' }}
      >
        <span className="material-icons">location_on</span>

        <span
          className="
            relative
            after:absolute after:left-0 after:bottom-0
            after:h-0.5 after:w-0 after:bg-current
            after:transition-all after:duration-200
            group-hover:after:w-full
            text-sm
          "
        >
          {ownLocationUsed ? 'Using your current location' : 'Use my current location'}
        </span>
      </button>

      <div className="w-full flex flex-col gap-2">
        <label className="text-xs" style={{ color: 'var(--color-muted)' }}>
          Location accuracy: ±{jitterMeters} meters
        </label>

        <input
          type="range"
          min={100}
          max={10000}
          step={100}
          value={jitterMeters}
          onChange={(e) => setJitterMeters(Number(e.target.value))}
          className="w-full"
          style={{
            color: 'var(--color-primary)',
          }}
          disabled={!baseLocation}
        />

        <p className="hidden md:block text-xs" style={{ color: 'var(--color-muted)' }}>
          Your exact location is never shared. The marker is randomly offset within approximately{' '}
          {jitterMeters} meters.
        </p>
      </div>
    </div>
  )
}

export default CoordinateSelectorButton
