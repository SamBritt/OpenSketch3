import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { Button, Input, Textarea } from '@/components'

interface Props {
  canvasRef: React.RefObject<HTMLCanvasElement>
  bgColor: string
  onClose: () => void
}

export default function SketchForm({ canvasRef, bgColor, onClose }: Props) {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Name is required.')
      return
    }
    const canvas = canvasRef.current
    if (!canvas) return
    setSaving(true)
    setError(null)
    try {
      const flat = document.createElement('canvas')
      flat.width = canvas.width
      flat.height = canvas.height
      const flatCtx = flat.getContext('2d')!
      flatCtx.fillStyle = bgColor
      flatCtx.fillRect(0, 0, flat.width, flat.height)
      flatCtx.drawImage(canvas, 0, 0)
      const imageUrl = flat.toDataURL('image/jpeg', 0.9)
      await api.post('/images', {
        name: name.trim(),
        description: description.trim(),
        imageUrl,
      })
      navigate(`/${useAuthStore.getState().user?.userName ?? ''}`)
    } catch {
      setError('Something went wrong. Please try again.')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-4 w-64 pt-1">
      <Input
        label="Name"
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Untitled sketch"
        autoFocus
      />

      <Textarea
        label="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="What's this sketch about?"
        rows={4}
      />

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          type="button"
          onClick={onClose}
          disabled={saving}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          size="sm"
          type="submit"
          loading={saving}
          className="flex-1"
        >
          Save
        </Button>
      </div>
    </form>
  )
}
