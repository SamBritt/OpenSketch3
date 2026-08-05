import { useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CommentSection, Avatar } from '@/components'
import GalleryCard from '@/components/gallery/GalleryCard'
import { useImageStore } from '@/store/imageStore'
import { useCommentStore } from '@/store/commentStore'

const ImageDetail = () => {
  const params = useParams()
  const commentRef = useRef<HTMLDivElement>(null)

  const { currentImage, currentImageLoading, userImages, fetchImage, fetchUserImages, likeImage, unlikeImage } = useImageStore()
  const { comments, fetchComments } = useCommentStore()

  useEffect(() => {
    if (!params.id || !params.userName) return
    fetchImage(parseInt(params.id))
    fetchUserImages(params.userName)
    fetchComments(parseInt(params.id))
  }, [params.id, params.userName])

  const scrollToComments = () => commentRef.current?.scrollIntoView({ behavior: 'smooth' })

  if (currentImageLoading) return null

  if (!currentImage) return (
    <main className="flex items-center justify-center m-8 text-da-subtle">
      Image not found.
    </main>
  )

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* 1. Image */}
      {currentImage.imageUrl && (
        <div className="rounded-xl overflow-hidden bg-da-surface border border-da-border">
          <img
            src={currentImage.imageUrl}
            alt={currentImage.name}
            className="w-full object-contain max-h-[70vh]"
          />
        </div>
      )}

      {/* 2. Artist + meta row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar userName={currentImage.userName} size="sm" />
          <Link
            to={`/${currentImage.userName}`}
            className="text-da-green font-medium hover:underline"
          >
            @{currentImage.userName}
          </Link>
          <span className="text-da-border">•</span>
          <span className="text-da-text font-semibold">{currentImage.name}</span>
        </div>
        <div className="flex gap-4 text-sm text-da-subtle">
          <span>&#9829; {currentImage.likes}</span>
          <span>&#128065; {currentImage.views}</span>
          <span>&#128172; {comments.length}</span>
        </div>
      </div>

      {/* 3. Action bar */}
      <div className="flex gap-3">
        <button
          onClick={() => currentImage.liked ? unlikeImage(currentImage.id) : likeImage(currentImage.id)}
          className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
            currentImage.liked
              ? 'bg-da-green text-white'
              : 'border border-da-border text-da-subtle hover:border-da-green'
          }`}
        >
          {currentImage.liked ? '&#9829; Liked' : '&#9825; Like'}
        </button>
        <button
          onClick={scrollToComments}
          className="border border-da-border text-da-subtle px-4 py-1.5 rounded text-sm hover:border-da-green transition-colors"
        >
          &#128172; Comment
        </button>
      </div>

      {/* 4. Description */}
      {currentImage.description && (
        <p className="text-da-subtle text-sm leading-relaxed">{currentImage.description}</p>
      )}

      {/* 5. Comments */}
      <div ref={commentRef}>
        <CommentSection comments={comments} imageId={currentImage.id} />
      </div>

      {/* 6. More by artist */}
      {userImages.length > 1 && (
        <div>
          <h3 className="text-da-subtle text-sm uppercase tracking-wider mb-3">
            More by{' '}
            <Link to={`/${currentImage.userName}`} className="text-da-green">
              @{currentImage.userName}
            </Link>
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {userImages
              .filter(img => img.id !== currentImage.id)
              .slice(0, 4)
              .map(img => (
                <GalleryCard key={img.id} item={img} />
              ))}
          </div>
        </div>
      )}
    </main>
  )
}

export default ImageDetail
