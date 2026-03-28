'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import useUserStore from '@/stores/useUserStore'

export default function SignupPage() {
  const { signup } = useUserStore()
  const router = useRouter()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [generalError, setGeneralError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function validate() {
    const newErrors = {
      firstName: '', lastName: '', username: '',
      email: '', password: '', confirmPassword: ''
    }
    let isValid = true

    if (!form.firstName.trim()) { newErrors.firstName = 'First name is required'; isValid = false }
    if (!form.lastName.trim()) { newErrors.lastName = 'Last name is required'; isValid = false }
    if (!form.username.trim()) {
      newErrors.username = 'Username is required'; isValid = false
    } else if (form.username.includes(' ')) {
      newErrors.username = 'Username cannot contain spaces'; isValid = false
    }
    if (!form.email.trim()) {
      newErrors.email = 'Email is required'; isValid = false
    } else if (!form.email.includes('@')) {
      newErrors.email = 'Enter a valid email'; isValid = false
    }
    if (!form.password) {
      newErrors.password = 'Password is required'; isValid = false
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'; isValid = false
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'; isValid = false
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'; isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  async function handleSubmit() {
    if (!validate()) return

    setIsLoading(true)
    setGeneralError('')

    try {
      await signup(form)
      router.push('/login')
    } catch {
      setGeneralError('Something went wrong. Please try again.')
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
        <p className="text-sm text-gray-400 mt-1">Create your account</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-md mx-auto w-full">

        {generalError && (
          <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-xl mb-4">
            {generalError}
          </div>
        )}

        {/* First + Last name */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <label className="text-xs font-medium text-gray-600">First Name</label>
            <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="John"
              className={`w-full mt-1 border rounded-xl px-3 py-2.5 text-sm outline-none transition ${errors.firstName ? 'border-red-400' : 'border-gray-200 focus:border-teal-400'}`} />
            {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
          </div>
          <div className="flex-1">
            <label className="text-xs font-medium text-gray-600">Last Name</label>
            <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Doe"
              className={`w-full mt-1 border rounded-xl px-3 py-2.5 text-sm outline-none transition ${errors.lastName ? 'border-red-400' : 'border-gray-200 focus:border-teal-400'}`} />
            {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
          </div>
        </div>

        {/* Username */}
        <div className="mb-4">
          <label className="text-xs font-medium text-gray-600">Username</label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
            <input type="text" name="username" value={form.username} onChange={handleChange} placeholder="johndoe"
              className={`w-full border rounded-xl pl-7 pr-3 py-2.5 text-sm outline-none transition ${errors.username ? 'border-red-400' : 'border-gray-200 focus:border-teal-400'}`} />
          </div>
          {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="text-xs font-medium text-gray-600">Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@example.com"
            className={`w-full mt-1 border rounded-xl px-3 py-2.5 text-sm outline-none transition ${errors.email ? 'border-red-400' : 'border-gray-200 focus:border-teal-400'}`} />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="text-xs font-medium text-gray-600">Password</label>
          <div className="relative mt-1">
            <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters"
              className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none transition pr-10 ${errors.password ? 'border-red-400' : 'border-gray-200 focus:border-teal-400'}`} />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <span className="material-icons text-base">{showPassword ? 'visibility_off' : 'visibility'}</span>
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label className="text-xs font-medium text-gray-600">Confirm Password</label>
          <div className="relative mt-1">
            <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Repeat your password"
              className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none transition pr-10 ${errors.confirmPassword ? 'border-red-400' : 'border-gray-200 focus:border-teal-400'}`} />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <span className="material-icons text-base">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
            </button>
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
        </div>

        {/* Submit */}
        <button onClick={handleSubmit} disabled={isLoading}
          className={`w-full bg-yellow-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}>
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>

        <p className="text-center text-sm text-gray-400 mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-teal-600 font-semibold hover:underline">Log in</Link>
        </p>

      </div>
    </div>
  )
}