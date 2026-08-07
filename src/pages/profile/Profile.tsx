import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Gallery, Avatar } from '@/components'
import { useImageStore } from '@/store/imageStore'
import api from '@/lib/api'
import { User } from '@/types'

type Tab = 'gallery' | 'about'

const Profile = () => {
  const params = useParams()
  const { userImages, fetchUserImages } = useImageStore()
  const [profileUser, setProfileUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('gallery')

  useEffect(() => {
    if (params.userName) fetchUserImages(params.userName)
  }, [params.userName])

  useEffect(() => {
    if (!params.userName) return
    api.get<User>(`/users/username/${params.userName}`).then(r => setProfileUser(r.data))
  }, [params.userName])

  return (
    <main>
      <header className="h-48 bg-gradient-to-br from-da-surface to-da-bg border-b border-da-border" />

      <div className="flex items-end gap-4 px-8 -mt-12 pb-4">
        <div className="ring-4 ring-da-green rounded-full flex-shrink-0">
          <Avatar userName={profileUser?.userName ?? params.userName ?? ''} avatarUrl={profileUser?.avatarUrl} size="lg" />
        </div>
        <div className="pb-2">
          <h1 className="text-2xl font-bold text-da-text">
            {profileUser?.userName ?? params.userName}
          </h1>
          <p className="text-da-subtle text-sm">
            {profileUser ? `${profileUser.firstName} ${profileUser.lastName}` : ''}
          </p>
          <p className="text-da-subtle text-xs mt-1">{userImages.length} Deviations</p>
        </div>
      </div>

      <div className="flex border-b border-da-border px-8 mt-4">
        {(['gallery', 'about'] as Tab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm cursor-pointer capitalize transition-colors ${
              activeTab === tab
                ? 'text-da-green border-b-2 border-da-green -mb-px font-medium'
                : 'text-da-subtle hover:text-da-text'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="px-8 py-6">
        {activeTab === 'gallery' && (
          <section aria-label="Gallery">
            <Gallery images={userImages} />
            {userImages.length === 0 && (
              <p className="text-da-subtle text-sm">No deviations yet.</p>
            )}
          </section>
        )}

        {activeTab === 'about' && (
          <section aria-label="About">
            <dl className="max-w-lg space-y-3 text-sm text-da-subtle">
              <div>
                <dt className="text-da-text font-medium inline">Display name: </dt>
                <dd className="inline">
                  {profileUser ? `${profileUser.firstName} ${profileUser.lastName}` : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-da-text font-medium inline">Username: </dt>
                <dd className="inline">@{profileUser?.userName ?? params.userName}</dd>
              </div>
              <div>
                <dt className="text-da-text font-medium inline">Deviations: </dt>
                <dd className="inline">{userImages.length}</dd>
              </div>
            </dl>
          </section>
        )}
      </div>
    </main>
  )
}

export default Profile
