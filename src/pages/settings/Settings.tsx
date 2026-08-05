import { useRef, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import Avatar from '@/components/Avatar'

export default function Settings() {
  const { user, updateAvatar } = useAuthStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  if (!user) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result as string)
      setMessage(null)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (!preview) return
    setSaving(true)
    setMessage(null)
    try {
      await updateAvatar(preview)
      setMessage({ type: 'success', text: 'Avatar updated successfully.' })
      setPreview(null)
    } catch {
      setMessage({ type: 'error', text: 'Failed to update avatar. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="bg-da-surface border border-da-border rounded-xl p-8 w-full max-w-md flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-da-text">Account Settings</h1>

        <div className="flex flex-col gap-4">
          <h2 className="text-xs uppercase tracking-widest text-da-muted border-b border-da-border pb-2 mb-4">
            Avatar
          </h2>

          <div className="flex items-center gap-6">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <Avatar userName={user.userName} avatarUrl={user.avatarUrl} size="lg" />
            )}

            <div className="flex flex-col gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 text-sm bg-da-elevated border border-da-border hover:border-da-green text-da-text rounded transition-colors"
              >
                Change Avatar
              </button>
              {preview && (
                <button
                  onClick={() => setPreview(null)}
                  className="px-4 py-2 text-sm bg-da-elevated border border-da-border hover:border-da-green text-da-text rounded transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {preview && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="py-2 text-sm bg-da-green hover:bg-da-green-hover text-white font-semibold rounded w-full disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          )}

          {message && (
            <p className={`text-sm ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
              {message.text}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
