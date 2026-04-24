import { useState } from 'react'
import { useCommentStore } from '@/store/commentStore'
import { Comment } from '@/types'

const CommentSection = ({ comments, imageId }: { comments: Comment[], imageId: number }) => {
  const { postComment, deleteComment } = useCommentStore()
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

  return (
    <section className='flex flex-col gap-y-4'>
      <h1 className='flex flex-row items-center gap-x-2 text-lg text-stone-200 font-semibold'>
        <span>Comments</span>
        <span className='text-sm'>{comments.length}</span>
      </h1>

      <div className='flex gap-x-2 w-1/2'>
        <div className='w-10 h-10 rounded-full bg-zinc-500 shrink-0' />
        <div className='flex flex-col flex-1 gap-2'>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKey}
            placeholder='Add a comment…'
            rows={2}
            className='w-full bg-zinc-700 text-gray-200 rounded px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 placeholder-zinc-500 resize-none'
          />
          <button
            onClick={submit}
            disabled={submitting || !text.trim()}
            className='self-end px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-40 transition-colors'
          >
            {submitting ? 'Posting…' : 'Post'}
          </button>
        </div>
      </div>

      {comments.length ? comments.map(item => (
        <div key={item.id} className='flex w-1/2 h-full gap-x-2'>
          <div className='w-10 h-10 rounded-full bg-zinc-500 shrink-0' />
          <div className='flex-1 h-full bg-zinc-600 p-4 rounded-md text-sm'>
            <span className='text-blue-400 font-medium mr-2'>@{item.userName}</span>
            <span className='text-gray-200'>{item.comment}</span>
          </div>
          <button
            onClick={() => deleteComment(item.id)}
            className='self-start text-zinc-500 hover:text-red-400 transition-colors text-lg leading-none'
            title='Delete comment'
          >
            ×
          </button>
        </div>
      )) : (
        <div className='text-gray-500 text-sm'>No comments yet.</div>
      )}
    </section>
  )
}

export default CommentSection
