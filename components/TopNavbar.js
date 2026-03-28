'use client'

import Link from 'next/link'

export default function TopNavbar() {
  return (
    <nav className="bg-yellow-600 text-white px-4 h-14 flex items-center justify-between shadow-md fixed top-0 w-full z-10">

      {/* Left — Create post */}
      <div className="flex-1">
        <Link href="/create" className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition">
          <span className="material-icons text-2xl">add</span>
        </Link>
      </div>

      {/* Center — App name */}
      <div className="flex-1 text-center">
        <h1 className="font-bold text-lg tracking-wide">Knowledge</h1>
      </div>

      {/* Right — Notifications */}
      <div className="flex-1 flex justify-end">
        <Link href="/notifications" className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition relative">
          <span className="material-icons text-2xl">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-400 rounded-full border-2 border-gray-900"></span>
        </Link>
      </div>

    </nav>
  )
}