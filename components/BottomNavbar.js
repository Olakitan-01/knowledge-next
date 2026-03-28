'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNavbar() {
  const pathname = usePathname()

  const isActive = (path) => pathname === path

  return (
    <nav
      className="bg-gray-400 border-t border-gray-800 fixed bottom-0 w-full flex justify-around items-center py-3 px-2 z-10"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <Link href="/home" className={`flex flex-col items-center transition ${isActive('/home') ? 'text-teal-400' : 'text-gray-500 hover:text-white'}`}>
        <span className="material-icons text-3xl">home</span>
      </Link>

      <Link href="/home" className={`flex flex-col items-center transition ${isActive('/videos') ? 'text-teal-400' : 'text-gray-500 hover:text-white'}`}>
        <span className="material-icons text-3xl">movie</span>
      </Link>

      <Link href="/home" className={`flex flex-col items-center transition ${isActive('/create') ? 'text-teal-400' : 'text-gray-500 hover:text-white'}`}>
        <span className="material-icons text-3xl">send</span>
      </Link>

      <Link href="/home" className={`flex flex-col items-center transition ${isActive('/notifications') ? 'text-teal-400' : 'text-gray-500 hover:text-white'}`}>
        <span className="material-icons text-3xl">search</span>
      </Link>

      <Link href="/profile" className={`flex flex-col items-center transition ${isActive('/profile') ? 'text-teal-400' : 'text-gray-500 hover:text-white'}`}>
        <span className="material-icons text-3xl">account_circle</span>
      </Link>
    </nav>
  )
}