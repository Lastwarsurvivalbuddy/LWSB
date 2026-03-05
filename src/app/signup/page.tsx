'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSignUp = async () => {
    if (!email || !password) {
      setMessage('Please enter your email and password.')
      return
    }
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    setMessage('')
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setMessage(error.message)
    } else {
      setIsSuccess(true)
      setMessage('Check your email for a confirmation link.')
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#07080a] flex items-center justify-center">
      <div className="bg-[#0e1014] border border-[#2a3040] rounded-xl p-8 w-full max-w-md">
        <h1 className="text-[#e8a020] font-bold text-2xl tracking-widest uppercase text-center mb-2">
          Join the Fight
        </h1>
        <p className="text-[#606878] text-sm text-center mb-8">
          Create your Commander account
        </p>

        {isSuccess ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-4">📬</div>
            <p className="text-white font-bold mb-2">Check your email</p>
            <p className="text-[#606878] text-sm">
              We sent a confirmation link to <span className="text-[#e8a020]">{email}</span>.
              Click it to activate your account, then sign in.
            </p>
            <a
              href="/signin"
              className="inline-block mt-6 text-[#e8a020] text-sm hover:underline"
            >
              Back to Sign In
            </a>
          </div>
        ) : (
          <>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#07080a] border border-[#2a3040] rounded-lg px-4 py-3 text-white placeholder-[#606878] mb-4 outline-none focus:border-[#e8a020]"
            />
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#07080a] border border-[#2a3040] rounded-lg px-4 py-3 text-white placeholder-[#606878] mb-6 outline-none focus:border-[#e8a020]"
            />
            <button
              onClick={handleSignUp}
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#c0281a] to-[#e8a020] text-white font-bold py-3 rounded-lg uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
            {message && (
              <p className="text-center mt-4 text-sm text-red-400">{message}</p>
            )}
            <p className="text-center mt-6 text-sm text-[#606878]">
              Already have an account?{' '}
              <a href="/signin" className="text-[#e8a020] hover:underline">
                Sign in
              </a>
            </p>
          </>
        )}
      </div>
    </main>
  )
}
