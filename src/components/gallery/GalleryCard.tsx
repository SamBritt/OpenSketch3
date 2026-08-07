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
          api.get<Image>(`/images/${item.id}`).then(({ data }) => {
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
    <article>
      <Link
        to={`/${item.userName}/${item.id}`}
        className="group block bg-da-surface border border-da-border rounded-lg overflow-hidden transition-all duration-200 hover:border-da-green hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/50"
      >
        <div ref={ref} className="aspect-square bg-da-elevated">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={item.name}
              onLoad={() => setLoaded(true)}
              className={`object-cover w-full h-full transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            />
          )}
        </div>
        <footer className="px-3 py-2">
          <p className="text-sm text-da-text font-medium truncate">{item.name}</p>
          <div className="flex justify-between text-xs text-da-subtle mt-1">
            <span>@{item.userName}</span>
            <span>&#9829; {item.likes}</span>
          </div>
        </footer>
      </Link>
    </article>
  )
}

export function GalleryCardSkeleton() {
  return (
    <article className="block bg-da-surface border border-da-border rounded-lg overflow-hidden animate-pulse">
      <div className="aspect-square bg-da-elevated" />
      <div className="px-3 py-2 space-y-2">
        <div className="h-3 bg-da-elevated rounded w-3/4" />
        <div className="h-3 bg-da-elevated rounded w-1/2" />
      </div>
    </article>
  )
}
