
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
      alert('Please select an image')
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

      alert('Post uploaded successfully!')
      router.push('/')

    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center">

      {/* Header */}
      <header className="w-full bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Instagram</h1>
        <button
          onClick={() => router.push('/')}
          className="text-gray-600 hover:text-black"
        >
          Cancel
        </button>
      </header>

      {/* Create Post */}
      <div className="w-full max-w-4xl mt-10 px-4">

        <div className="bg-white border rounded-xl overflow-hidden">

          {/* Title */}
          <div className="border-b p-4 text-center">
            <h2 className="font-semibold text-lg">Create new post</h2>
          </div>

          <form onSubmit={handleUpload}>

            <div className="grid grid-cols-1 md:grid-cols-2">

              {/* Image Preview */}
              <div className="bg-gray-100 min-h-[350px] flex items-center justify-center">

                {preview ? (
                  <img
                    src={preview}
                    alt="Post preview"
                    className="w-full h-full max-h-[550px] object-contain"
                  />
                ) : (
                  <div className="text-center p-8">
                    <div className="text-6xl mb-4">📷</div>
                    <p className="text-lg font-medium">
                      Drag photos here
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Share your photos with friends
                    </p>

                    <label className="inline-block mt-5 bg-blue-500 text-white px-5 py-2 rounded-lg cursor-pointer hover:bg-blue-600">
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
                  <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center">
                    👤
                  </div>
                  <span className="font-semibold">Create a post</span>
                </div>

                <textarea
                  placeholder="Write a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  maxLength={2200}
                  className="w-full resize-none outline-none min-h-[200px] text-sm"
                />

                <div className="text-gray-400 text-xs text-right mt-2">
                  {caption.length}/2,200
                </div>

                {image && (
                  <p className="text-xs text-gray-500 mt-3 truncate">
                    Selected: {image.name}
                  </p>
                )}

                <div className="mt-auto pt-6">

                  {!preview && (
                    <label className="block text-center border rounded-lg p-2 mb-3 cursor-pointer hover:bg-gray-50">
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
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-lg disabled:opacity-50"
                  >
                    {loading ? 'Sharing...' : 'Share'}
                  </button>

                </div>

              </div>

            </div>
          </form>
        </div>

        <p className="text-center text-gray-400 text-xs mt-5">
          Share your moments with everyone.
        </p>

      </div>
    </main>
  )
}
