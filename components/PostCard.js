'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import usePostsStore from '@/stores/usePostsStore'
import useUserStore from '@/stores/useUserStore'

export default function PostCard({ post }) {
  const { updatePost, deletePost } = usePostsStore()
  const { profile } = useUserStore()
  const router = useRouter()

  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    body: post?.body || '',
    tags: post?.tags?.join(', ') || ''
  })

  const isOwner = profile?._id?.toString() === post?.userId?.toString()

  const formattedDate = post?.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : ''

  function handleEditChange(e) {
    setEditForm({ ...editForm, [e.target.name]: e.target.value })
  }

  async function saveEdit() {
    await updatePost(post._id, {
      body: editForm.body,
      tags: editForm.tags.split(',').map(t => t.trim()).filter(Boolean)
    })
    setIsEditing(false)
  }

  function cancelEdit() {
    setEditForm({
      body: post?.body || '',
      tags: post?.tags?.join(', ') || ''
    })
    setIsEditing(false)
  }

  async function handleDelete() {
    if (window.confirm('Delete this post?')) {
      await deletePost(post._id)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 overflow-hidden">

      {!isEditing ? (
        <>
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center overflow-hidden">
                {post.avatar
                  ? <img src={post.avatar} className="w-full h-full object-cover" />
                  : <span className="material-icons text-amber-500 text-xl">person</span>
                }
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{post.username}</p>
                <p className="text-xs text-gray-400">{formattedDate}</p>
              </div>
            </div>

            {isOwner && (
              <div className="flex gap-1">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 text-gray-400 hover:text-amber-500 rounded-full hover:bg-amber-50 transition"
                >
                  <span className="material-icons text-base">edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition"
                >
                  <span className="material-icons text-base">delete</span>
                </button>
              </div>
            )}
          </div>

          {/* Media */}
          {post.mediaUrl && (
            <div className="w-full cursor-pointer" onClick={() => router.push(`/post/${post._id}`)}>
              {post.mediaType === 'image' && (
                <img src={post.mediaUrl} alt="post media" className="w-full max-h-80 object-cover" />
              )}
              {post.mediaType === 'video' && (
                <video src={post.mediaUrl} controls className="w-full max-h-80" />
              )}
            </div>
          )}

          {/* Body */}
          <div className="px-5 pt-3 cursor-pointer" onClick={() => router.push(`/post/${post._id}`)}>
            <p className="text-gray-800 text-base leading-relaxed">{post.body}</p>
          </div>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 px-5 pt-2">
              {post.tags.map(tag => (
                <span key={tag} className="text-xs text-amber-500 bg-amber-50 px-3 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Action bar */}
          <div className="flex items-center gap-5 px-5 py-3 mt-1 border-t border-gray-50">
            <button className="flex items-center gap-1.5 text-gray-400 hover:text-red-500 transition">
              <span className="material-icons text-base">favorite_border</span>
              <span className="text-xs">Like</span>
            </button>
            <button className="flex items-center gap-1.5 text-gray-400 hover:text-amber-500 transition">
              <span className="material-icons text-base">chat_bubble_outline</span>
              <span className="text-xs">Comment</span>
            </button>
          </div>
        </>
      ) : (
        <div className="p-5">
          <textarea
            name="body"
            value={editForm.body}
            onChange={handleEditChange}
            rows={4}
            className="w-full text-gray-800 text-base resize-none outline-none border border-gray-200 rounded-xl p-3"
          />
          <input
            type="text"
            name="tags"
            value={editForm.tags}
            onChange={handleEditChange}
            placeholder="Tags: react, javascript"
            className="w-full mt-2 text-sm text-gray-500 outline-none border border-gray-200 rounded-xl px-3 py-2"
          />
          <div className="flex gap-2 mt-3 justify-end">
            <button onClick={cancelEdit}
              className="text-sm text-gray-500 px-4 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={saveEdit}
              className="text-sm text-white bg-amber-500 hover:bg-amber-600 px-4 py-1.5 rounded-full">
              Save
            </button>
          </div>
        </div>
      )}

    </div>
  )
}