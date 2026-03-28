'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useUserStore from '@/stores/useUserStore'
import usePostsStore from '@/stores/usePostsStore'
import AuthLayout from '@/components/AuthLayout'

export default function ProfilePage() {
  const { profile, fetchProfile, updateProfile } = useUserStore()
  const { posts, fetchPosts } = usePostsStore()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState('posts')
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    bio: '',
    gender: ''
  })

  useEffect(() => {
    fetchProfile()
    fetchPosts()
  }, [fetchPosts, fetchProfile])

  function startEdit() {
    setEditForm({
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      username: profile?.username || '',
      bio: profile?.bio || '',
      gender: profile?.gender || ''
    })
    setIsEditing(true)
  }

  async function saveProfile() {
    await updateProfile(editForm)
    setIsEditing(false)
  }

  function cancelEdit() {
    setIsEditing(false)
  }

  const userPosts = posts.filter(p =>
    p.userId?.toString() === profile?._id?.toString()
  )

  if (!profile) {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
          <span className="material-icons text-4xl">hourglass_empty</span>
          <p className="text-sm mt-2">Loading profile...</p>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="min-h-screen bg-gray-50">

        {/* Profile Card */}
        <div className="bg-white border-b border-gray-100 px-5 py-6 max-w-lg mx-auto">

          {!isEditing ? (
            <>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center overflow-hidden">
                    {profile.avatar
                      // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
                      ? <img src={profile.avatar} className="w-full h-full object-cover" />
                      : <span className="material-icons text-amber-500 text-4xl">person</span>
                    }
                  </div>
                  {/* Info */}
                  <div>
                    <p className="text-base font-bold text-gray-800">
                      {profile.firstName} {profile.lastName}
                    </p>
                    <p className="text-sm text-gray-400">@{profile.username}</p>
                    <p className="text-xs text-gray-400 mt-0.5 capitalize">{profile.gender}</p>
                  </div>
                </div>

                <button
                  onClick={startEdit}
                  className="text-sm text-amber-500 border border-amber-500 px-4 py-1.5 rounded-full hover:bg-amber-50 transition"
                >
                  Edit
                </button>
              </div>

              <p className="text-sm text-gray-600 mt-4 leading-relaxed">{profile.bio}</p>

              <div className="mt-4">
                <span className="text-sm font-bold text-gray-800">{userPosts.length}</span>
                <span className="text-sm text-gray-400 ml-1">Posts</span>
              </div>
            </>
          ) : (
            <div className="space-y-3">

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 font-medium">First Name</label>
                  <input
                    type="text"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-400"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 font-medium">Last Name</label>
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 font-medium">Username</label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 font-medium">Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  rows={3}
                  className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none resize-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 font-medium">Gender</label>
                <select
                  value={editForm.gender}
                  onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                  className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-400"
                >
                  <option value="">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end pt-1">
                <button
                  onClick={cancelEdit}
                  className="text-sm text-gray-500 px-4 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveProfile}
                  className="text-sm text-white bg-amber-500 hover:bg-amber-600 px-4 py-1.5 rounded-full"
                >
                  Save
                </button>
              </div>

            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex bg-white border-b border-gray-100 max-w-lg mx-auto">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-3 text-sm font-semibold transition ${activeTab === 'posts' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-gray-400'}`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab('liked')}
            className={`flex-1 py-3 text-sm font-semibold transition ${activeTab === 'liked' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-gray-400'}`}
          >
            Liked
          </button>
        </div>

        {/* Tab Content */}
        <div className="px-4 py-4 max-w-lg mx-auto">

          {activeTab === 'posts' && (
            <>
              {userPosts.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <span className="material-icons text-4xl">auto_stories</span>
                  <p className="text-sm mt-2">No posts yet.</p>
                </div>
              ) : (
                userPosts.map(post => (
                  <div
                    key={post._id}
                    onClick={() => router.push(`/post/${post._id}`)}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-3 cursor-pointer"
                  >
                    <p className="text-gray-800 text-sm leading-relaxed">{post.body}</p>

                    {post.mediaUrl && post.mediaType === 'image' && (
                      <div className="mt-2 rounded-xl overflow-hidden">
                        <image src={post.mediaUrl} className="w-full max-h-40 object-cover" />
                      </div>
                    )}

                    {post.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {post.tags.map(tag => (
                          <span key={tag} className="text-xs text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'liked' && (
            <div className="text-center py-10 text-gray-400">
              <span className="material-icons text-4xl">favorite_border</span>
              <p className="text-sm mt-2">Posts you like will appear here.</p>
            </div>
          )}

        </div>
      </div>
    </AuthLayout>
  )
}