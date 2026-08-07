import { useState } from 'react'
import { useCommentStore } from '@/store/commentStore'
import { useAuthStore } from '@/store/authStore'
import { Comment } from '@/types'
import Avatar from '@/components/Avatar'
import { Button, Textarea } from '@/components'

const CommentSection = ({ comments, imageId }: { comments: Comment[], imageId: number }) => {
  const { postComment, deleteComment } = useCommentStore()
  const { user } = useAuthStore()
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async () => {
    if (!text.trim()) return
    setSubmitting(true)
    await postComment(imageId, text.trim())
    setText('')
    setSubmitting(false)
  }

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault()
    submit()
  }

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const handleDelete = (id: number) => {
    if (!window.confirm('Delete this comment?')) return
    deleteComment(id)
  }

  return (
    <section className="flex flex-col gap-y-4">
      <h2 className="flex flex-row items-center gap-x-2 text-lg text-da-text font-semibold">
        <span>Comments</span>
        <span className="text-sm text-da-subtle">{comments.length}</span>
      </h2>

      <div className="flex gap-x-2 w-full">
        <Avatar userName={user?.userName ?? '?'} avatarUrl={user?.avatarUrl} size="md" />
        <form onSubmit={handlePost} className="flex flex-col flex-1 gap-2">
          <Textarea
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Add a comment…"
            rows={2}
            className="w-full"
          />
          <Button
            variant="primary"
            size="sm"
            type="submit"
            disabled={submitting || !text.trim()}
            loading={submitting}
            className="self-end"
          >
            {submitting ? 'Posting…' : 'Post'}
          </Button>
        </form>
      </div>

      {comments.length ? (
        <ul className="flex flex-col gap-y-4">
          {comments.map(item => (
            <li key={item.id} className="flex w-full gap-x-3 items-start">
              <article className="flex w-full gap-x-3 items-start">
                <Avatar userName={item.userName} avatarUrl={item.avatarUrl} size="md" />
                <div className="flex-1 bg-da-elevated border border-da-border rounded-lg p-3 text-sm relative">
                  <span className="text-da-green font-medium">@{item.userName}</span>
                  <p className="text-da-text mt-1">{item.comment}</p>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="absolute top-2 right-2 text-da-muted hover:text-red-400 text-sm leading-none transition-colors"
                    title="Delete comment"
                  >
                    &#215;
                  </button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-da-subtle text-sm">No comments yet.</div>
      )}
    </section>
  )
}

export default CommentSection
