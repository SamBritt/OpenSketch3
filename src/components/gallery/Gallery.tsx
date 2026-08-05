import { Image } from '@/types'
import GalleryCard, { GalleryCardSkeleton } from './GalleryCard'

const Gallery = ({ images = [], condensed = false, loading = false }: { images: Image[], condensed?: boolean, loading?: boolean }) => {
  if (loading) {
    return (
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <GalleryCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="columns-2 sm:columns-3 lg:columns-4 gap-4">
      {images.map(item => (
        <GalleryCard key={item.id} item={item} />
      ))}
    </div>
  )
}

export default Gallery
