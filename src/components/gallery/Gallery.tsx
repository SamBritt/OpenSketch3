import { Image } from '@/types'
import GalleryCard, { GalleryCardSkeleton } from './GalleryCard'

const Gallery = ({ images = [], condensed = false, loading = false }: { images: Image[], condensed?: boolean, loading?: boolean }) => {
  if (loading) {
    return (
      <ul className="columns-2 sm:columns-3 lg:columns-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <li key={i} className="mb-4 break-inside-avoid">
            <GalleryCardSkeleton />
          </li>
        ))}
      </ul>
    )
  }

  return (
    <ul className="columns-2 sm:columns-3 lg:columns-4 gap-4">
      {images.map(item => (
        <li key={item.id} className="mb-4 break-inside-avoid">
          <GalleryCard item={item} />
        </li>
      ))}
    </ul>
  )
}

export default Gallery
