import { useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CommentSection, Avatar, Button } from '@/components'
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
    <article className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {currentImage.imageUrl && (
        <figure className="rounded-xl overflow-hidden bg-da-surface border border-da-border">
          <img
            src={currentImage.imageUrl}
            alt={currentImage.name}
            className="w-full object-contain max-h-[70vh]"
          />
          <figcaption className="sr-only">{currentImage.name} by @{currentImage.userName}</figcaption>
        </figure>
      )}

      <header className="flex items-center justify-between">
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
        <dl className="flex gap-4 text-sm text-da-subtle">
          <div>
            <dt className="sr-only">Likes</dt>
            <dd>&#9829; {currentImage.likes}</dd>
          </div>
          <div>
            <dt className="sr-only">Views</dt>
            <dd>&#128065; {currentImage.views}</dd>
          </div>
          <div>
            <dt className="sr-only">Comments</dt>
            <dd>&#128172; {comments.length}</dd>
          </div>
        </dl>
      </header>

      <div className="flex gap-3">
        <Button
          variant={currentImage.liked ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => currentImage.liked ? unlikeImage(currentImage.id) : likeImage(currentImage.id)}
        >
          {currentImage.liked ? '♥ Liked' : '♡ Like'}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={scrollToComments}
        >
          💬 Comment
        </Button>
      </div>

      {currentImage.description && (
        <section aria-label="Description">
          <p className="text-da-subtle text-sm leading-relaxed">{currentImage.description}</p>
        </section>
      )}

      <div ref={commentRef}>
        <CommentSection comments={comments} imageId={currentImage.id} />
      </div>

      {userImages.length > 1 && (
        <section aria-label={`More by @${currentImage.userName}`}>
          <h3 className="text-da-subtle text-sm uppercase tracking-wider mb-3">
            More by{' '}
            <Link to={`/${currentImage.userName}`} className="text-da-green">
              @{currentImage.userName}
            </Link>
          </h3>
          <ul className="flex gap-3">
            {userImages
              .filter(img => img.id !== currentImage.id)
              .slice(0, 4)
              .map(img => (
                <li key={img.id} className="flex-1 min-w-0">
                  <GalleryCard item={img} />
                </li>
              ))}
          </ul>
        </section>
      )}
    </article>
  )
}

export default ImageDetail
