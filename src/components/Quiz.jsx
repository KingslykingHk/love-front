import { useState } from 'react'
import questions from '../data/questions'
import { toast } from 'react-toastify'

export default function Quiz() {
  const [responses, setResponses] = useState({})
  const [thought, setThought] = useState('') // Q27 textarea

  // Handle Yes / No
  const handleAnswer = (id, value) => {
    setResponses((prev) => ({
      ...prev,
      [String(id)]: {
        answer: value,
        percentage: prev[String(id)]?.percentage ?? 50,
      },
    }))
  }

  // Handle percentage slider
  const handlePercentage = (id, value) => {
    setResponses((prev) => ({
      ...prev,
      [String(id)]: {
        answer: prev[String(id)]?.answer ?? 'Yes',
        percentage: value,
      },
    }))
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

          {/* Yes / No */}
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => handleAnswer(q.id, 'Yes')}
              className={`flex-1 py-2 rounded-xl transition ${
                responses[String(q.id)]?.answer === 'Yes'
                  ? 'bg-pink-500 text-white'
                  : 'bg-white/40 text-gray-800'
              }`}
            >
              Yes ❤️
            </button>

            <button
              onClick={() => handleAnswer(q.id, 'No')}
              className={`flex-1 py-2 rounded-xl transition ${
                responses[String(q.id)]?.answer === 'No'
                  ? 'bg-pink-500 text-white'
                  : 'bg-white/40 text-gray-800'
              }`}
            >
              No 💔
            </button>
          </div>

          {/* Percentage Slider */}
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

      {/* Question 27 – Text Area */}
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

            const res = await fetch('http://localhost:5000/your-answers', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                verifiedUser: 'Hurrshini',
                answers: formattedAnswers,
                thought,
              }),
            })

            const data = await res.json()

            if (data.success) {
              toast.success('💖 Quiz submitted successfully')
            } else {
              toast.error(data.message || 'Something went wrong')
            }
          } catch (err) {
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
