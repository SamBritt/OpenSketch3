import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '@/lib/api'
import { Image } from '@/types'
import { useImageStore } from '@/store/imageStore'

export default function GalleryCard({ item }: { item: Image }) {
  const ref = useRef<HTMLDivElement>(null)
  const cacheImageUrl = useImageStore(state => state.cacheImageUrl)
  const [imageUrl, setImageUrl] = useState<string | null>(item.imageUrl ?? null)
  const [loaded, setLoaded] = useState(!!item.imageUrl)

  useEffect(() => {
    if (item.imageUrl) return

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect()
          api.get<Image>(`/images/${item.id}`, { params: { userId: 1 } }).then(({ data }) => {
            if (data.imageUrl) {
              setImageUrl(data.imageUrl)
              cacheImageUrl(item.id, data.imageUrl)
            }
          })
        }
      },
      { rootMargin: '200px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [item.id])

  return (
    <Link className='group' to={`/${item.userName}/${item.id}`}>
      <div
        ref={ref}
        className='relative bg-zinc-600 w-full h-0 pb-full rounded-lg transition-all ease duration-200 group-hover:-translate-y-1 hover:shadow-xl overflow-hidden'
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt={item.name}
            onLoad={() => setLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
        <div className='absolute bottom-0 left-0 bg-zinc-800 w-full rounded-b-lg opacity-0 h-0 group-hover:opacity-100 group-hover:h-1/2 transition-all ease duration-300 px-2 py-1 text-sm text-gray-200'>
          {item.name}
        </div>
      </div>
    </Link>
  )
}
