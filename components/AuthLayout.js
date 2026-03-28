'use client'
import { useEffect } from 'react'
import TopNavbar from './TopNavbar'
import BottomNavbar from './BottomNavbar'
import useUserStore from '@/stores/useUserStore'

export default function AuthLayout({ children }) {
    const { fetchProfile, init } = useUserStore()

    useEffect(() => {
        init()        // ← initialize from localStorage first
        fetchProfile() // ← then fetch profile
    }, [fetchProfile, init])
  return (
    <div className="pb-16 pt-14 min-h-screen bg-gray-50">
      <TopNavbar />
      <main>
        {children}
      </main>
      <BottomNavbar />
    </div>
  )
}