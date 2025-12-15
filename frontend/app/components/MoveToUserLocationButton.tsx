'use client'

const MoveToUserLocationButton = () => {
  const handleMoveToUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const {latitude, longitude} = position.coords
        const event = new CustomEvent('moveToLocation', {
          detail: {lat: latitude, lng: longitude},
        })
        window.dispatchEvent(event)
      })
    } else {
      alert('Geolocation is not supported by this browser.')
    }
  }

  return (
    <button
      onClick={handleMoveToUserLocation}
      className="cursor-pointer material-icons fixed bottom-48 right-8 z-40 h-14 w-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all"
      style={{backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)'}}
    >
      my_location
    </button>
  )
}

export default MoveToUserLocationButton
