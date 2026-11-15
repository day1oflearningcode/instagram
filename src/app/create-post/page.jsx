
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { createClient } from '@/lib/supabase/client'

export default function CreatePost() {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [caption, setCaption] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  const handleImageChange = (e) => {
    const file = e.target.files[0]

    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()

    if (!image) {
      toast.error('Please select an image')
      return
    }

    setLoading(true)

    try {
      const { data: { user }, error: userError } =
        await supabase.auth.getUser()

      if (userError) throw userError
      if (!user) throw new Error('Please log in first')

      const filePath = `${user.id}/${crypto.randomUUID()}-${image.name}`

      const { error: uploadError } = await supabase.storage
        .from('posts')
        .upload(filePath, image)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('posts')
        .getPublicUrl(filePath)

      const { error: insertError } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          caption,
          image_url: data.publicUrl
        })

      if (insertError) throw insertError

      toast.success('Post uploaded successfully!')
      router.push('/')

    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">

      {/* Header */}
      <header className="w-full bg-black border-b border-[#262626] px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1
            className="text-2xl font-bold cursor-pointer"
            onClick={() => router.push('/')}
          >
            Instagram
          </h1>

          <button
            onClick={() => router.push('/')}
            className="text-gray-400 hover:text-white transition"
          >
            Cancel
          </button>
        </div>
      </header>

      {/* Create Post */}
      <div className="w-full max-w-4xl mx-auto mt-12 px-4 pb-10">

        <div className="bg-[#121212] border border-[#262626] rounded-xl overflow-hidden">

          {/* Title */}
          <div className="border-b border-[#262626] p-4 text-center">
            <h2 className="font-semibold text-lg">
              Create new post
            </h2>
          </div>

          <form onSubmit={handleUpload}>

            <div className="grid grid-cols-1 md:grid-cols-2">

              {/* Image Preview */}
              <div className="bg-[#080808] min-h-[400px] flex items-center justify-center border-b md:border-b-0 md:border-r border-[#262626]">

                {preview ? (
                  <div className="w-full h-full min-h-[400px] flex items-center justify-center relative">
                    <img
                      src={preview}
                      alt="Post preview"
                      className="w-full max-h-[550px] object-contain"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        setImage(null)
                        setPreview(null)
                      }}
                      className="absolute top-4 right-4 bg-black/70 hover:bg-black text-white rounded-full w-9 h-9"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <div className="text-6xl mb-5">📷</div>

                    <p className="text-lg font-medium">
                      Drag photos here
                    </p>

                    <p className="text-sm text-gray-500 mt-2">
                      Share your photos with friends
                    </p>

                    <label className="inline-block mt-6 bg-[#0095f6] text-white px-5 py-2 rounded-lg cursor-pointer hover:bg-[#1877f2] transition font-semibold text-sm">
                      Select from computer

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

              </div>

              {/* Caption Section */}
              <div className="flex flex-col p-5">

                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
                    <div className="w-full h-full rounded-full bg-[#121212] flex items-center justify-center">
                      👤
                    </div>
                  </div>

                  <span className="font-semibold text-sm">
                    Create a post
                  </span>
                </div>

                <textarea
                  placeholder="Write a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  maxLength={2200}
                  className="w-full resize-none outline-none min-h-[200px] bg-transparent text-white text-sm placeholder:text-gray-500"
                />

                <div className="text-gray-500 text-xs text-right mt-2">
                  {caption.length}/2,200
                </div>

                {image && (
                  <p className="text-xs text-gray-500 mt-3 truncate">
                    Selected: {image.name}
                  </p>
                )}

                <div className="mt-auto pt-6">

                  {!preview && (
                    <label className="block text-center border border-[#363636] text-gray-300 rounded-lg p-3 mb-3 cursor-pointer hover:bg-[#262626] transition text-sm">
                      Select image

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !image}
                    className="w-full bg-[#0095f6] hover:bg-[#1877f2] text-white font-semibold py-3 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    {loading ? 'Sharing...' : 'Share'}
                  </button>

                </div>

              </div>

            </div>
          </form>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          Share your moments with everyone.
        </p>

      </div>
    </main>
  )
}
