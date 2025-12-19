import { useState } from 'react'
import questions from '../data/questions'
import { toast } from 'react-toastify'

export default function Quiz() {
  const [responses, setResponses] = useState({})
  const [thought, setThought] = useState('')
  const [preview, setPreview] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)

  const handleAnswer = (id, value) => {
    setResponses((prev) => ({
      ...prev,
      [String(id)]: {
        answer: value,
        percentage: prev[String(id)]?.percentage ?? 50,
      },
    }))
  }

  const handlePercentage = (id, value) => {
    setResponses((prev) => ({
      ...prev,
      [String(id)]: {
        answer: prev[String(id)]?.answer ?? 'Yes',
        percentage: value,
      },
    }))
  }

  // 📸 CAMERA → CLOUDINARY (FILLED)
  const handleCamera = async (file) => {
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'love_upload') // ✅ preset name
    formData.append('folder', 'love-selfies')

    try {
      const res = await fetch(
        'https://api.cloudinary.com/v1_1/dtnuqhcrq/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      )

      const data = await res.json()

      if (!data.secure_url) {
        toast.error('Image upload failed')
        return
      }

      setPreview(data.secure_url)
      setImageUrl(data.secure_url)
      toast.success('📸 Pic captured ❤️')
    } catch (err) {
      toast.error('Camera upload failed 😢')
    }
  }

  return (
    <div className="z-10 w-full max-w-md mx-auto px-4 py-6 space-y-6 overflow-y-auto">

      {/* Questions 1–26 */}
      {questions.map((q, index) => (
        <div
          key={q.id}
          className="bg-white/30 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20"
        >
          <p className="text-sm text-gray-600 mb-2">
            Question {index + 1}
          </p>

          <h2 className="text-lg font-bold text-pink-700 mb-4">
            {q.question}
          </h2>

          <div className="flex gap-4 mb-4">
            <button
              onClick={() => handleAnswer(q.id, 'Yes')}
              className={`flex-1 py-2 rounded-xl ${
                responses[String(q.id)]?.answer === 'Yes'
                  ? 'bg-pink-500 text-white'
                  : 'bg-white/40'
              }`}
            >
              Yes ❤️
            </button>

            <button
              onClick={() => handleAnswer(q.id, 'No')}
              className={`flex-1 py-2 rounded-xl ${
                responses[String(q.id)]?.answer === 'No'
                  ? 'bg-pink-500 text-white'
                  : 'bg-white/40'
              }`}
            >
              No 💔
            </button>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={responses[String(q.id)]?.percentage ?? 50}
            onChange={(e) =>
              handlePercentage(q.id, Number(e.target.value))
            }
            className="w-full accent-pink-500"
          />

          <div className="flex justify-between mt-2 font-semibold">
            <span className="text-pink-600">
              Yes ❤️ {responses[String(q.id)]?.percentage ?? 50}%
            </span>
            <span className="text-gray-600">
              No 💔 {100 - (responses[String(q.id)]?.percentage ?? 50)}%
            </span>
          </div>
        </div>
      ))}

      {/* Question 27 */}
      <div className="bg-white/30 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
        <p className="text-sm text-gray-600 mb-2">Question 27</p>

        <h2 className="text-lg font-bold text-pink-700 mb-4">
          What does Hurrshini want to tell Kingsly? 💌
        </h2>

        <textarea
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          placeholder="Type your message here..."
          rows={4}
          className="w-full p-3 rounded-xl outline-none text-sm"
        />

        {/* CAMERA UI */}
        <div className="mt-4 text-center space-y-2">
          <p className="text-pink-600 font-medium">
            Click your pic to cool me down ❤️
          </p>

          <label className="inline-block cursor-pointer bg-pink-500 text-white px-4 py-2 rounded-xl">
            Open Camera 📸 (Say cheeeese 😄)
            <input
              type="file"
              accept="image/*"
              capture="user"
              className="hidden"
              onChange={(e) => handleCamera(e.target.files[0])}
            />
          </label>

          {preview && (
            <img
              src={preview}
              alt="preview"
              className="mx-auto mt-3 w-40 rounded-xl shadow-lg"
            />
          )}
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={async () => {
          try {
            const formattedAnswers = Object.keys(responses).map((id) => ({
              questionId: id,
              answer: responses[id].answer,
              percentage: responses[id].percentage,
            }))

            const res = await fetch(
              'https://love-f9y2.onrender.com/your-answers',
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  verifiedUser: 'Hurrshini',
                  answers: formattedAnswers,
                  thought,
                  imageUrl,
                }),
              }
            )

            const data = await res.json()
            if (data.success) toast.success('💖 Quiz submitted')
            else toast.error(data.message || 'Something went wrong')
          } catch {
            toast.error('Backend not reachable 😢')
          }
        }}
        className="w-full py-3 bg-pink-600 text-white rounded-xl text-lg"
      >
        Submit with ❤️
      </button>
    </div>
  )
}
