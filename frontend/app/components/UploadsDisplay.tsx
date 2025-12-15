import Image from 'next/image'
import {Upload} from '../types/Upload'

const UploadsDisplay = ({uploads}: {uploads: Upload[]}) => {
  return (
    <div
      className="
        columns-1
        sm:columns-2
        lg:columns-3
        xl:columns-4
        px-4
      "
    >
      {uploads
        .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
        .map((item) => (
          <div
            key={item._id}
            className="
              mb-6
              break-inside-avoid
            "
          >
            {item._type === 'imageUpload' ? (
              <div className="overflow-hidden bg-white">
                {item.imageUrl && item.asset?.metadata?.dimensions && (
                  <div
                    className="relative w-full"
                    style={{
                      aspectRatio:
                        item.asset.metadata.dimensions.width /
                        item.asset.metadata.dimensions.height,
                    }}
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.caption || 'Uploaded image'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                )}

                {item.caption && <div className="p-2 text-sm text-gray-700">{item.caption}</div>}
              </div>
            ) : item._type === 'quote' ? (
              <div
                className="
                  p-6
                  bg-gray-50
                  border-l-4 border-gray-300
                  text-gray-800
                "
              >
                <p className="text-lg italic leading-snug">“{item.text}”</p>
                {item.author && <p className="mt-2 text-sm text-gray-600">- {item.author}</p>}
              </div>
            ) : null}
          </div>
        ))}
    </div>
  )
}

export default UploadsDisplay
