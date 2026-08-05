import { useState } from 'react'
import { useCommentStore } from '@/store/commentStore'
import { useAuthStore } from '@/store/authStore'
import { Comment } from '@/types'
import Avatar from '@/components/Avatar'

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
        <div className="flex flex-col flex-1 gap-2">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Add a comment…"
            rows={2}
            className="w-full bg-da-elevated border border-da-border text-da-text rounded px-3 py-2 text-sm outline-none focus:border-da-green placeholder-da-muted resize-none transition-colors"
          />
          <button
            onClick={submit}
            disabled={submitting || !text.trim()}
            className="self-end px-4 py-1.5 text-sm bg-da-green hover:bg-da-green-hover text-white rounded disabled:opacity-40 transition-colors"
          >
            {submitting ? 'Posting…' : 'Post'}
          </button>
        </div>
      </div>

      {comments.length ? comments.map(item => (
        <div key={item.id} className="flex w-full gap-x-3 items-start">
          <Avatar userName={item.userName} size="md" />
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
        </div>
      )) : (
        <div className="text-da-subtle text-sm">No comments yet.</div>
      )}
    </section>
  )
}

export default CommentSection
