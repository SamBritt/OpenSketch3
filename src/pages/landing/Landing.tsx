import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Gallery, Button } from '@/components'
import { useImageStore } from '@/store/imageStore'
import { useAuthStore } from '@/store/authStore'

const Landing = () => {
  const { images, imagesLoading, fetchImages } = useImageStore()
  const { user } = useAuthStore()

  useEffect(() => {
    fetchImages()
  }, [])

  return (
    <main>
      {user === null && (
        <section aria-label="Hero" className="py-20 text-center">
          <h1 className="text-4xl font-bold text-da-text">Discover Digital Art</h1>
          <p className="text-da-subtle mt-2">The home for digital artists and sketch enthusiasts.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/create">
              <Button variant="primary" size="lg">Start Creating</Button>
            </Link>
            <a href="#gallery">
              <Button variant="secondary" size="lg">Browse Art</Button>
            </a>
          </div>
        </section>
      )}

      <div className="flex justify-between items-center px-8 py-4 border-b border-da-border">
        <span className="text-lg font-semibold text-da-text">Latest Art</span>
        <div className="flex gap-2">
          <select className="bg-da-elevated border border-da-border text-da-subtle text-sm rounded px-2 py-1 outline-none">
            <option>Newest</option>
          </select>
          <select className="bg-da-elevated border border-da-border text-da-subtle text-sm rounded px-2 py-1 outline-none">
            <option>All Categories</option>
          </select>
        </div>
      </div>

      <div id="gallery" className="px-8 py-6">
        <Gallery images={images} loading={imagesLoading} />
        {images.length === 0 && !imagesLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-5xl mb-4">&#9999;&#65039;</span>
            <p className="text-da-subtle text-sm mb-4">No art here yet. Be the first to create something.</p>
            <Link to="/create">
              <Button variant="primary" size="lg">Start Creating</Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}

export default Landing
