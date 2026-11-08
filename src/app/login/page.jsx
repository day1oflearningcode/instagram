'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

const Login = () => {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()

      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (loginError) throw loginError

      router.push('/')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fafafa] p-6">
      <div className="w-full max-w-[350px]">
        <div className="border border-zinc-200 bg-white px-10 py-10">
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="1.8"
                className="h-9 w-9"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="white" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              social
            </h1>

            <p className="mt-2 text-sm text-zinc-500">Share your moments.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-sm border border-zinc-300 bg-[#fafafa] px-3 py-3 text-xs outline-none transition focus:border-zinc-500"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-sm border border-zinc-300 bg-[#fafafa] px-3 py-3 text-xs outline-none transition focus:border-zinc-500"
            />

            {error && <p className="text-center text-xs text-red-500">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="h-9 w-full rounded-lg bg-[#0095f6] text-sm font-semibold text-white hover:bg-[#1877f2]"
            >
              {loading ? 'Logging in...' : 'Log in'}
            </Button>
          </form>
        </div>

        <div className="mt-3 border border-zinc-200 bg-white p-5 text-center">
          <p className="text-sm text-zinc-700">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={() => router.push('/signup')}
              className="font-semibold text-[#0095f6] hover:text-[#1877f2]"
            >
              Sign up
            </button>
          </p>
        </div>

        <p className="mt-8 text-center text-xs text-zinc-400">© 2026 SOCIAL</p>
      </div>
    </main>
  )
}

export default Login
