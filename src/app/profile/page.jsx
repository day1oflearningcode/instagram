
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Profile() {
  const supabase = createClient()
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .maybeSingle()

      if (error) {
        setMessage(error.message)
      } else {
        setUsername(data?.username ?? '')
      }

      setLoading(false)
    }

    getProfile()
  }, [supabase, router])

  const updateUsername = async () => {
    setMessage('')

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const cleanUsername = username.trim().replace(/^@/, '')

    if (!cleanUsername) {
      setMessage('Enter a username')
      return
    }

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        username: cleanUsername
      }, {
        onConflict: 'id'
      })

    if (error) {
      setMessage(error.message)
    } else {
      setUsername(cleanUsername)
      setMessage('Username updated!')
    }
  }

  if (loading) {
    return <p className="bg-black text-white min-h-screen p-8">Loading...</p>
  }

  return (
    <main className="min-h-screen bg-black text-white flex justify-center items-center p-5">
      <div className="w-full max-w-md bg-[#121212] border border-[#262626] rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

        <label className="text-sm text-gray-400">
          Username
        </label>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          className="w-full mt-2 mb-4 p-3 rounded-lg bg-[#1e1e1e] border border-[#363636] outline-none"
        />

        <button
          onClick={updateUsername}
          className="w-full bg-[#0095f6] hover:bg-blue-600 rounded-lg p-3 font-semibold"
        >
          Save Changes
        </button>

        {message && (
          <p className="text-sm text-center mt-4 text-gray-300">
            {message}
          </p>
        )}
      </div>
    </main>
  )
}
