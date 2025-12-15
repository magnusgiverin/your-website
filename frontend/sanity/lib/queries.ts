import {defineQuery} from 'next-sanity'

export const allUploadsQuery = defineQuery(`
  *[_type in ["imageUpload", "quote"]] | order(uploadedAt desc) {
    _id,
    _type,
    _createdAt,
    ...,

    "imageUrl": image.asset->url,

    "asset": image.asset->{
      _id,
      url,
      metadata {
        dimensions {
          width,
          height,
          aspectRatio
        }
      }
    },

    coordinates
  }
`)
