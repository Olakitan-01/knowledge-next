'use client'

import { useEffect } from 'react'
import usePostsStore from '@/stores/usePostsStore'
import PostCard from '@/components/PostCard'
import AuthLayout from '@/components/AuthLayout'

export default function HomePage() {
  const { posts, hasMore, fetchPosts, loadMore } = usePostsStore()

  useEffect(() => {
    fetchPosts(1)
  }, [fetchPosts])

  return (
    <AuthLayout>
      <div className="min-h-screen bg-gray-50 px-4 py-6 max-w-lg mx-auto">

        {/* Empty state */}
        {posts.length === 0 && (
          <div className="text-center mt-20 text-gray-400">
            <span className="material-icons text-5xl">auto_stories</span>
            <p className="mt-2 text-sm">No posts yet. Be the first to share knowledge!</p>
          </div>
        )}

        {/* Posts feed */}
        {posts.map(post => (
          <PostCard key={post._id} post={post} />
        ))}

        {/* Load more */}
        {posts.length >= 10 && hasMore && (
          <div className="text-center py-4">
            <button
              onClick={loadMore}
              className="text-sm text-teal-600 border border-teal-600 px-6 py-2 rounded-full hover:bg-teal-50 transition"
            >
              Load more
            </button>
          </div>
        )}

        {/* All caught up */}
        {posts.length >= 10 && !hasMore && (
          <div className="text-center py-4 text-gray-400 text-sm">
            You&apos;re all caught up!
          </div>
        )}

      </div>
    </AuthLayout>
  )
}