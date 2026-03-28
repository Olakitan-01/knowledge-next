'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import usePostsStore from '@/stores/usePostsStore'
import useUserStore from '@/stores/useUserStore'
import AuthLayout from '@/components/AuthLayout'

export default function PostDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { posts, fetchPosts } = usePostsStore()
  const { profile } = useUserStore()

  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  useEffect(() => {
    if (posts.length === 0) {
      fetchPosts()
    }
  }, [fetchPosts, posts.length])

  const post = posts.find(p => p._id === id)

  const formattedDate = post?.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : ''

  function toggleLike() {
    setLiked(!liked)
    setLikeCount(liked ? likeCount - 1 : likeCount + 1)
  }

  function submitComment() {
    if (!newComment.trim()) return
    setComments([...comments, {
      id: Date.now(),
      username: profile?.firstName + ' ' + profile?.lastName,
      body: newComment,
      createdAt: new Date().toLocaleString()
    }])
    setNewComment('')
  }

  if (!post) {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
          <span className="material-icons text-4xl">hourglass_empty</span>
          <p className="text-sm mt-2">Loading post...</p>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="min-h-screen bg-gray-50">

        {/* Header */}
        <div className="flex items-center gap-4 px-4 py-4 bg-white border-b border-gray-100">
          <button
            onClick={() => router.back()}
            className="text-gray-500 hover:text-gray-800"
          >
            <span className="material-icons">arrow_back</span>
          </button>
          <h2 className="text-lg font-bold text-gray-800">Post</h2>
        </div>

        <div className="max-w-lg mx-auto px-4 py-5">

          {/* Post Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">

            {/* Author */}
            <div className="flex items-center gap-3 px-5 pt-4 pb-2">
              <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center overflow-hidden">
                {post.avatar
                  ? <image src={post.avatar} className="w-full h-full object-cover rounded-full" />
                  : <span className="material-icons text-amber-500 text-xl">person</span>
                }
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{post.username}</p>
                <p className="text-xs text-gray-400">{formattedDate}</p>
              </div>
            </div>

            {/* Media */}
            {post.mediaUrl && (
              <div className="w-full">
                {post.mediaType === 'image' && (
                  <image src={post.mediaUrl} className="w-full object-cover" />
                )}
                {post.mediaType === 'video' && (
                  <video src={post.mediaUrl} controls className="w-full" />
                )}
              </div>
            )}

            {/* Body */}
            <div className="px-5 pt-3">
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

            {/* Like & Comment */}
            <div className="flex items-center gap-5 px-5 py-3 mt-1 border-t border-gray-50">
              <button
                onClick={toggleLike}
                className={`flex items-center gap-1.5 transition ${liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
              >
                <span className="material-icons text-base">
                  {liked ? 'favorite' : 'favorite_border'}
                </span>
                <span className="text-xs">{likeCount} Likes</span>
              </button>

              <div className="flex items-center gap-1.5 text-gray-400">
                <span className="material-icons text-base">chat_bubble_outline</span>
                <span className="text-xs">{comments.length} Comments</span>
              </div>
            </div>

          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

            <h3 className="text-sm font-bold text-gray-700 mb-4">Comments</h3>

            {comments.length === 0 && (
              <div className="text-center py-4 text-gray-400">
                <span className="material-icons text-3xl">chat_bubble_outline</span>
                <p className="text-sm mt-1">No comments yet. Start the conversation!</p>
              </div>
            )}

            {comments.map(comment => (
              <div key={comment.id} className="flex gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <span className="material-icons text-amber-500 text-base">person</span>
                </div>
                <div className="bg-gray-50 rounded-xl px-4 py-2 flex-1">
                  <p className="text-xs font-semibold text-gray-700">{comment.username}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{comment.body}</p>
                  <p className="text-xs text-gray-400 mt-1">{comment.createdAt}</p>
                </div>
              </div>
            ))}

            {/* Comment input */}
            <div className="flex items-center gap-3 mt-4 border-t border-gray-50 pt-4">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <span className="material-icons text-amber-500 text-base">person</span>
              </div>
              <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2">
                <input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submitComment()}
                  type="text"
                  placeholder="Write a comment..."
                  className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400"
                />
                <button
                  onClick={submitComment}
                  className="text-amber-500 hover:text-amber-600"
                >
                  <span className="material-icons text-base">send</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </AuthLayout>
  )
}