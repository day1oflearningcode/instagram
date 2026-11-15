
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Profile = {
  username: string | null
  full_name: string | null
  avatar_url: string | null
}

type Post = {
  id: string
  user_id: string
  image_url: string
  caption: string
  created_at: string
  profiles: Profile | null
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          user_id,
          image_url,
          caption,
          created_at,
          profiles (
            username,
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching posts:', error)
      } else {
        setPosts((data ?? []) as Post[])
      }

      setLoading(false)
    }

    fetchPosts()
  }, [supabase])

  return (
    <main className="min-h-screen bg-black text-white">

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-[245px] border-r border-[#262626] bg-black px-6 py-8 hidden md:flex flex-col">

        <div
          onClick={() => router.push('/')}
          className="mb-10 cursor-pointer px-2"
        >
          <div className="flex items-center gap-3">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.8"
              className="w-8 h-8"
            >
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="white" />
            </svg>

            <span className="text-2xl font-bold">
              Instagram
            </span>
          </div>
        </div>

        <nav className="flex flex-col gap-3">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#1a1a1a] font-semibold text-left"
          >
            <span className="text-xl">⌂</span>
            Home
          </button>

          <button
            onClick={() => router.push('/create-post')}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#1a1a1a] text-left"
          >
            <span className="text-xl">＋</span>
            Create
          </button>

          <button
            onClick={() => router.push('/profile')}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#1a1a1a] text-left"
          >
            <span className="text-xl">♙</span>
            Profile
          </button>
        </nav>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-50 bg-black border-b border-[#262626] px-5 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Instagram</h1>

        <button
          onClick={() => router.push('/create-post')}
          className="text-sm font-semibold text-[#0095f6]"
        >
          Create
        </button>
      </header>

      {/* Main Feed */}
      <section className="md:ml-[245px] flex justify-center px-4 py-8">
        <div className="w-full max-w-[470px]">

          {loading && (
            <p className="text-center text-gray-400 py-10">
              Loading posts...
            </p>
          )}

          {!loading && posts.length === 0 && (
            <div className="text-center py-24">
              <h2 className="text-xl font-semibold">
                Share your first photo
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                Your posts will appear here.
              </p>

              <button
                onClick={() => router.push('/create-post')}
                className="mt-5 text-[#0095f6] font-semibold text-sm"
              >
                Create post
              </button>
            </div>
          )}

          {/* Posts */}
          {posts.map((post) => {
            const profile = post.profiles
            const username =
              profile?.username || profile?.full_name || 'User'

            return (
              <article
                key={post.id}
                className="mb-8 border-b border-[#262626] pb-5"
              >

                {/* User information */}
                <div className="flex items-center gap-3 mb-3 px-1">

                  {/* Avatar */}
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#262626] flex items-center justify-center font-bold">
                      {username.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* Username and date */}
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">
                      {username}
                    </span>

                    <span className="text-xs text-gray-500">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>

                </div>

                {/* Post Image */}
                <img
                  src={post.image_url}
                  alt="Post"
                  className="w-full max-h-[600px] object-contain rounded-sm bg-[#121212]"
                />

                {/* Caption */}
                <div className="pt-3 px-1">
                  <p className="text-sm break-words">
                    <span className="font-semibold mr-2">
                      {username}
                    </span>

                    {post.caption}
                  </p>
                </div>

              </article>
            )
          })}

        </div>
      </section>
    </main>
  )
}
