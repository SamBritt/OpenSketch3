import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../lib/api'

interface Props {
  canvasRef: React.RefObject<HTMLCanvasElement>
  onClose: () => void
}

export default function SketchForm({ canvasRef, onClose }: Props) {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    if (!name.trim()) {
      setError('Name is required.')
      return
    }
    const canvas = canvasRef.current
    if (!canvas) return
    setSaving(true)
    setError(null)
    try {
      const imageUrl = canvas.toDataURL('image/png')
      await api.post('/images', {
        name: name.trim(),
        description: description.trim(),
        imageUrl,
        userId: 1,
      })
      navigate('/')
    } catch {
      setError('Something went wrong. Please try again.')
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 w-64 pt-1">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-400 uppercase tracking-wider">Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Untitled sketch"
          autoFocus
          className="bg-zinc-700 text-gray-200 rounded px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 placeholder-zinc-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-400 uppercase tracking-wider">Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="What's this sketch about?"
          rows={4}
          className="bg-zinc-700 text-gray-200 rounded px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 placeholder-zinc-500 resize-none"
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-2">
        <button
          onClick={onClose}
          disabled={saving}
          className="flex-1 py-1.5 text-sm bg-zinc-700 text-gray-200 rounded hover:bg-zinc-600 disabled:opacity-40 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={submit}
          disabled={saving}
          className="flex-1 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  )
}
