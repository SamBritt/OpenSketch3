import { Image } from '@/types'
import GalleryCard from './GalleryCard'

const Gallery = ({ images = [], condensed = false }: { images: Image[], condensed?: boolean }) => {
  const gridClass = [
    'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2',
    !condensed && 'xl:grid-cols-4',
  ].filter(Boolean).join(' ')

  return (
    <div className={gridClass}>
      {images.map(item => (
        <GalleryCard key={item.id} item={item} />
      ))}
    </div>
  )
}

export default Gallery
