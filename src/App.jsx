import { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import VerificationModal from './components/VerificationModal'
import Hearts from './components/Hearts'
import Quiz from './components/Quiz'

export default function App() {
  const [verified, setVerified] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-300 to-purple-400 relative overflow-hidden">
      <Hearts />
      {!verified && <VerificationModal onSuccess={() => setVerified(true)} />}
      {verified && <Quiz />}
     
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </div>
  )
}
