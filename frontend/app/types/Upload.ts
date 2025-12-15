interface ImageDimensions {
  width: number
  height: number
  aspectRatio: number
}

interface ImageAsset {
  _id: string
  url: string
  metadata: {
    dimensions: ImageDimensions
  }
}

interface imageUpload {
  _id: string
  _type: 'imageUpload'
  image: {
    _type: 'image'
    asset: {
      _ref: string
      _type: 'reference'
    }
  }
  imageUrl: string
  caption?: string
  uploadedAt: string
  coordinates?: {
    _type: 'geopoint'
    lat: number
    lng: number
  }
  asset?: ImageAsset
}

interface quote {
  _id: string
  _type: 'quote'
  text: string
  author?: string
  uploadedAt: string
  coordinates?: {
    _type: 'geopoint'
    lat: number
    lng: number
  }
}

export type Upload = imageUpload | quote
