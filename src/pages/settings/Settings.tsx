import { useRef, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import Avatar from '@/components/Avatar'
import { Button, Input } from '@/components'

type Message = { type: 'success' | 'error'; text: string } | null

export default function Settings() {
  const { user, updateProfile } = useAuthStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [avatarSaving, setAvatarSaving] = useState(false)
  const [avatarMessage, setAvatarMessage] = useState<Message>(null)

  const [userName, setUserName] = useState(user?.userName ?? '')
  const [userNameSaving, setUserNameSaving] = useState(false)
  const [userNameMessage, setUserNameMessage] = useState<Message>(null)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<Message>(null)

  if (!user) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result as string)
      setAvatarMessage(null)
    }
    reader.readAsDataURL(file)
  }

  const handleAvatarSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!preview) return
    setAvatarSaving(true)
    setAvatarMessage(null)
    try {
      await updateProfile({ avatarUrl: preview })
      setAvatarMessage({ type: 'success', text: 'Avatar updated successfully.' })
      setPreview(null)
    } catch {
      setAvatarMessage({ type: 'error', text: 'Failed to update avatar. Please try again.' })
    } finally {
      setAvatarSaving(false)
    }
  }

  const handleUserNameSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setUserNameSaving(true)
    setUserNameMessage(null)
    try {
      await updateProfile({ userName })
      setUserNameMessage({ type: 'success', text: 'Username updated successfully.' })
    } catch (err: any) {
      setUserNameMessage({
        type: 'error',
        text: err.response?.data?.error ?? 'Failed to update username.',
      })
    } finally {
      setUserNameSaving(false)
    }
  }

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordMessage(null)
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New password and confirmation do not match.' })
      return
    }
    setPasswordSaving(true)
    try {
      await updateProfile({ currentPassword, newPassword })
      setPasswordMessage({ type: 'success', text: 'Password updated successfully.' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      setPasswordMessage({
        type: 'error',
        text: err.response?.data?.error ?? 'Failed to update password.',
      })
    } finally {
      setPasswordSaving(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="bg-da-surface border border-da-border rounded-xl p-8 w-full max-w-lg flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-da-text">Account Settings</h1>

        <section aria-label="Avatar settings" className="flex flex-col gap-4">
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
              <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                Change Avatar
              </Button>
              {preview && (
                <Button variant="secondary" onClick={() => setPreview(null)}>
                  Cancel
                </Button>
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
            <form onSubmit={handleAvatarSave}>
              <Button variant="primary" type="submit" loading={avatarSaving} className="w-full">
                Save
              </Button>
            </form>
          )}

          {avatarMessage && (
            <p className={`text-sm ${avatarMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
              {avatarMessage.text}
            </p>
          )}
        </section>

        <section aria-label="Username settings" className="flex flex-col gap-4">
          <h2 className="text-xs uppercase tracking-widest text-da-muted border-b border-da-border pb-2 mb-4">
            Username
          </h2>

          <form onSubmit={handleUserNameSave} className="flex flex-col gap-4">
            <Input
              label="New Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <Button variant="primary" type="submit" loading={userNameSaving} className="w-full">
              Save
            </Button>
          </form>

          {userNameMessage && (
            <p className={`text-sm ${userNameMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
              {userNameMessage.text}
            </p>
          )}
        </section>

        <section aria-label="Password settings" className="flex flex-col gap-4">
          <h2 className="text-xs uppercase tracking-widest text-da-muted border-b border-da-border pb-2 mb-4">
            Password
          </h2>

          <form onSubmit={handlePasswordSave} className="flex flex-col gap-4">
            <Input
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button variant="primary" type="submit" loading={passwordSaving} className="w-full">
              Save
            </Button>
          </form>

          {passwordMessage && (
            <p className={`text-sm ${passwordMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
              {passwordMessage.text}
            </p>
          )}
        </section>
      </div>
    </div>
  )
}
