
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error(error)
      } else {
        setPosts(data)
      }

      setLoading(false)
    }

    fetchPosts()
  }, [])

  return (
    <main className="min-h-screen bg-gray-50">

      <header className="bg-white border-b p-4">
        <h1 className="text-2xl font-bold text-center">
          Instagram
        </h1>
      </header>

      <div className="max-w-xl mx-auto py-8 px-4">

        {loading && <p>Loading posts...</p>}

        {!loading && posts.length === 0 && (
          <p className="text-center text-gray-500">
            No posts yet. Be the first to share!
          </p>
        )}

        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white border rounded-lg mb-6 overflow-hidden"
          >

            {/* Post Header */}
            <div className="p-4 font-semibold">
              User
            </div>

            {/* Uploaded Image */}
            <img
              src={post.image_url}
              alt="Post"
              className="w-full object-cover"
            />

            {/* Caption */}
            <div className="p-4">
              <p className="text-sm">
                <span className="font-bold">User </span>
                {post.caption}
              </p>
            </div>

          </div>
        ))}

      </div>
    </main>
  )
}
