import { create } from 'zustand'
import api from '../lib/axios'

const usePostsStore = create((set, get) => ({
  // State
  posts: [],
  hasMore: true,
  currentPage: 1,

  // Fetch all posts
  fetchPosts: async (page = 1) => {
  try {
    const response = await api.get(`/posts?page=${page}&limit=10`)
    const newPosts = response.data.posts || response.data

    if (page === 1) {
      set({ posts: newPosts })
    } else {
      set({ posts: [...get().posts, ...newPosts] })
    }

    set({
      hasMore: response.data.hasMore ?? false,
      currentPage: page
    })
  } catch {
    console.log('Failed to fetch posts')
  }
},

  // Load more
  loadMore: async () => {
    const { currentPage, hasMore } = get()
    if (hasMore) await get().fetchPosts(currentPage + 1)
  },

  // Create post
  createPost: async (postData) => {
    const response = await api.post('/posts', postData)
    set({ posts: [response.data, ...get().posts] })
  },

  // Update post
  updatePost: async (id, updatedData) => {
    const response = await api.patch(`/posts/${id}`, updatedData)
    set({
      posts: get().posts.map(p => p._id === id ? response.data : p)
    })
  },

  // Delete post
  deletePost: async (id) => {
    await api.delete(`/posts/${id}`)
    set({ posts: get().posts.filter(p => p._id !== id) })
  }
}))

export default usePostsStore