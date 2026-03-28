'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import useUserStore from '@/stores/useUserStore'

export default function LoginPage() {
  const { login } = useUserStore()
  const router = useRouter()

  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const [errors, setErrors] = useState({
    email: '',
    password: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [generalError, setGeneralError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function validate() {
    const newErrors = { email: '', password: '' }
    let isValid = true

    if (!form.email.trim()) {
      newErrors.email = 'Email is required'
      isValid = false
    } else if (!form.email.includes('@')) {
      newErrors.email = 'Enter a valid email'
      isValid = false
    }

    if (!form.password) {
      newErrors.password = 'Password is required'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  async function handleSubmit() {
    if (!validate()) return

    setIsLoading(true)
    setGeneralError('')

    try {
      await login(form)
      router.push('/home')
    } catch {
      setGeneralError('Invalid email or password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4 py-10">

      {/* Logo */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-yellow-600 flex items-center justify-center mx-auto mb-3">
          <span className="material-icons text-white text-3xl">auto_stories</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Knowledge</h1>
        <p className="text-sm text-gray-400 mt-1">Welcome back</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-md mx-auto w-full">

        {/* General error */}
        {generalError && (
          <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-xl mb-4">
            {generalError}
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="text-xs font-medium text-gray-600">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className={`w-full mt-1 border rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none transition ${errors.email ? 'border-red-400' : 'border-gray-200 focus:border-teal-400'}`}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="mb-2">
          <label className="text-xs font-medium text-gray-600">Password</label>
          <div className="relative mt-1">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Your password"
              className={`w-full border rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none transition pr-10 ${errors.password ? 'border-red-400' : 'border-gray-200 focus:border-teal-400'}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <span className="material-icons text-base">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
        </div>

        {/* Forgot password */}
        <div className="text-right mb-6">
          <a href="#" className="text-xs text-teal-600 hover:underline">Forgot password?</a>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full bg-yellow-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>

        {/* Signup link */}
        <p className="text-center text-sm text-gray-400 mt-4">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-teal-600 font-semibold hover:underline">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  )
}