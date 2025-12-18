import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

export default function VerificationModal({ onSuccess }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const canvasRef = useRef(null);
  const heartsRef = useRef([]);
  const quoteIntervalRef = useRef(null);
  
  // Love quotes - rotate faster (every 5 seconds)
  const loveQuotes = [
    "Hello Hurrshini, how are you?",
    "saputuriya nalla take care of ur health!! ",
    "now date is 23rd of octomber, namma sanda potu 4 months aguthu!!",
    "insta la unaku ipo 564 followers irukanga huge hope u got new friends dear",
    "udamba pathuko nalla have a good day dr",
    "my days with me is heaven mixed of hell ma",
    "with you i seen differnet kind of peoples.. peoples mindset!!.",
    "You're the missing piece I've been searching for.",
    "I've over everythink in my life..u r my fav person",
    "Loved you is the best thing that ever happened to me."
  ];
  const [currentQuote, setCurrentQuote] = useState("");
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Initialize floating hearts
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create hearts
    const createHearts = () => {
      const hearts = [];
      const heartCount = 60;
      
      for (let i = 0; i < heartCount; i++) {
        hearts.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 20 + 15,
          speedX: (Math.random() - 0.5) * 0.6,
          speedY: Math.random() * 0.4 + 0.1,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.01,
          opacity: Math.random() * 0.5 + 0.2,
          color: `hsl(${330 + Math.random() * 30}, ${70 + Math.random() * 20}%, ${65 + Math.random() * 20}%)`,
          type: Math.floor(Math.random() * 5),
          wobble: Math.random() * 0.01,
          wobbleSpeed: Math.random() * 0.03 + 0.02
        });
      }
      return hearts;
    };
    
    heartsRef.current = createHearts();
    
    // Animation loop
    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#ffecef');
      gradient.addColorStop(0.5, '#ffdde1');
      gradient.addColorStop(1, '#ffafbd');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw hearts
      heartsRef.current.forEach(heart => {
        // Update position
        heart.x += heart.speedX;
        heart.y += heart.speedY;
        heart.rotation += heart.rotationSpeed;
        
        // Add floating motion
        heart.x += Math.sin(Date.now() * 0.001 * heart.wobbleSpeed) * heart.wobble;
        heart.y += Math.cos(Date.now() * 0.001 * heart.wobbleSpeed) * heart.wobble;
        
        // Wrap around edges
        if (heart.x > canvas.width + 50) heart.x = -50;
        if (heart.x < -50) heart.x = canvas.width + 50;
        if (heart.y > canvas.height + 50) heart.y = -50;
        if (heart.y < -50) heart.y = canvas.height + 50;
        
        // Save context
        ctx.save();
        ctx.translate(heart.x, heart.y);
        ctx.rotate(heart.rotation);
        ctx.globalAlpha = heart.opacity;
        
        // Draw heart
        ctx.fillStyle = heart.color;
        ctx.font = `${heart.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Add glow effect
        ctx.shadowColor = heart.color;
        ctx.shadowBlur = 10;
        
        // Different heart emojis
        const heartEmojis = ['❤️', '💖', '💗', '💓', '💞', '💕'];
        ctx.fillText(heartEmojis[heart.type % heartEmojis.length], 0, 0);
        
        ctx.restore();
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Initialize and rotate quotes faster (every 5 seconds)
  useEffect(() => {
    // Set initial quote immediately
    setCurrentQuote(loveQuotes[0]);
    
    // Start rotating quotes every 5 seconds
    quoteIntervalRef.current = setInterval(() => {
      setQuoteIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % loveQuotes.length;
        setCurrentQuote(loveQuotes[nextIndex]);
        return nextIndex;
      });
    }, 2000); // 5 seconds instead of 15
    
    return () => {
      if (quoteIntervalRef.current) {
        clearInterval(quoteIntervalRef.current);
      }
    };
  }, []);

  // Manual quote navigation
  const nextQuote = () => {
    setQuoteIndex(prevIndex => {
      const nextIndex = (prevIndex + 1) % loveQuotes.length;
      setCurrentQuote(loveQuotes[nextIndex]);
      return nextIndex;
    });
  };

  const verify = async () => {
    if (!input.trim()) {
      setError("Please enter the magic word ❤️");
      triggerErrorHearts();
      return;
    }
    
    setIsAnimating(true);
    
    try {
      const res = await fetch(
        "http://localhost:5000/just-a-verification-hurrshini",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input }),
        }
      );

      const data = await res.json();

      if (data.verified) {
        triggerHeartExplosion();
        toast.success("💖 Verification successful!");
        setTimeout(() => onSuccess(), 1500);
      } else {
        triggerErrorHearts();
        toast.error("💔 That's not quite right");
        setError("That's not the magic word, sweetheart");
      }
    } catch (err) {
      triggerErrorHearts();
      toast.error("💝 Connection issue");
      setError("Please check your connection");
    } finally {
      setIsAnimating(false);
    }
  };

  const triggerHeartExplosion = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const explosionHearts = [];
    
    // Create explosion hearts
    for (let i = 0; i < 40; i++) {
      explosionHearts.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        speedX: (Math.random() - 0.5) * 10,
        speedY: (Math.random() - 0.5) * 10,
        size: Math.random() * 15 + 12,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.08,
        opacity: 1,
        color: `hsl(${330 + Math.random() * 30}, 100%, 70%)`,
        gravity: 0.1
      });
    }
    
    // Animate explosion
    const animateExplosion = () => {
      let allGone = true;
      
      explosionHearts.forEach(heart => {
        if (heart.opacity > 0) {
          allGone = false;
          
          // Update
          heart.x += heart.speedX;
          heart.y += heart.speedY;
          heart.speedY += heart.gravity;
          heart.rotation += heart.rotationSpeed;
          heart.opacity -= 0.015;
          
          // Draw
          ctx.save();
          ctx.translate(heart.x, heart.y);
          ctx.rotate(heart.rotation);
          ctx.globalAlpha = heart.opacity;
          ctx.fillStyle = heart.color;
          ctx.font = `${heart.size}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowColor = heart.color;
          ctx.shadowBlur = 10;
          ctx.fillText('❤️', 0, 0);
          ctx.restore();
        }
      });
      
      if (!allGone) {
        requestAnimationFrame(animateExplosion);
      }
    };
    
    animateExplosion();
  };

  const triggerErrorHearts = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const errorHearts = [];
    
    for (let i = 0; i < 15; i++) {
      errorHearts.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        speedX: (Math.random() - 0.5) * 6,
        speedY: (Math.random() - 0.5) * 6 - 3,
        size: Math.random() * 12 + 8,
        opacity: 1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.15
      });
    }
    
    const animateError = () => {
      let allGone = true;
      
      errorHearts.forEach(heart => {
        if (heart.opacity > 0) {
          allGone = false;
          
          heart.x += heart.speedX;
          heart.y += heart.speedY;
          heart.speedY += 0.2;
          heart.rotation += heart.rotationSpeed;
          heart.opacity -= 0.02;
          
          ctx.save();
          ctx.translate(heart.x, heart.y);
          ctx.rotate(heart.rotation);
          ctx.globalAlpha = heart.opacity;
          ctx.fillStyle = '#ff6b8b';
          ctx.font = `${heart.size}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowColor = '#ff6b8b';
          ctx.shadowBlur = 8;
          ctx.fillText('💔', 0, 0);
          ctx.restore();
        }
      });
      
      if (!allGone) {
        requestAnimationFrame(animateError);
      }
    };
    
    animateError();
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Canvas background with floating hearts */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0 }}
      />
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50/30 via-pink-50/30 to-rose-100/30"></div>

      {/* Main modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Quote display - with next button */}
          <div className="mb-8 animate-fade-in">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-rose-200 relative group hover:shadow-2xl transition-all duration-300">
              <button 
                onClick={nextQuote}
                className="absolute -right-3 -top-3 bg-rose-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg hover:bg-rose-600 hover:scale-110 transition-all duration-300 shadow-lg z-10"
                title="Next quote"
              >
                →
              </button>
              
              <p className="text-rose-800 italic text-xl font-medium pr-8">
                "{currentQuote}"
              </p>
              
              <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-2">
                  {["💖", "💗", "💓"].map((heart, i) => (
                    <span
                      key={i}
                      className="text-xl animate-pulse inline-block"
                      style={{ 
                        animationDelay: `${i * 0.2}s`,
                        animationDuration: '1.2s'
                      }}
                    >
                      {heart}
                    </span>
                  ))}
                </div>
                
                {/* Quote progress dots */}
                <div className="flex space-x-1">
                  {loveQuotes.slice(0, 5).map((_, index) => (
                    <div 
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === quoteIndex ? 'bg-rose-500 w-4' : 'bg-rose-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Quote timer progress bar */}
              <div className="mt-3 h-1 w-full bg-rose-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-rose-400 to-pink-400 rounded-full animate-progress"
                  style={{ animationDuration: '5s' }}
                />
              </div>
            </div>
          </div>

          {/* Modal card */}
          <div className={`bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border-2 border-white/60 transform transition-all duration-300 ${isAnimating ? 'scale-105' : 'scale-100'}`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 p-8 text-center relative overflow-hidden">
              <h2 className="text-3xl font-bold text-white mb-3">
                Enter the magic word to continue
              </h2>
              <p className="text-rose-100 text-lg">
                For someone special only
              </p>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Input section */}
              <div className="relative mb-8">
                <div className="flex items-center bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl border-2 border-rose-200 focus-within:border-rose-400 focus-within:ring-4 focus-within:ring-rose-100 transition-all duration-300 shadow-lg">
                  <div className="pl-5 pr-3">
                    <span className="text-2xl text-rose-500">💌</span>
                  </div>
                  <input
                    type="text"
                    className="w-full py-4 px-2 bg-transparent outline-none text-rose-900 placeholder-rose-400 text-lg"
                    placeholder="Type your name..."
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      setError("");
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && verify()}
                    autoFocus
                  />
                  <div className="pr-5 pl-3">
                    <span className="text-2xl text-rose-500 animate-bounce">
                      ❤️
                    </span>
                  </div>
                </div>
                
                {/* Error message */}
                {error && (
                  <div className="mt-4 ml-2 flex items-center text-rose-600 animate-shake bg-rose-50 rounded-xl p-3 border border-rose-200">
                    <span className="text-xl mr-3">💔</span>
                    <span className="text-md font-medium">{error}</span>
                  </div>
                )}
              </div>

              {/* Submit button */}
              <button
                onClick={verify}
                disabled={isAnimating}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-3 shadow-lg ${
                  isAnimating 
                    ? 'bg-gradient-to-r from-rose-300 to-pink-300 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 hover:shadow-xl'
                }`}
              >
                {isAnimating ? (
                  <>
                    <span className="animate-spin text-xl">💫</span>
                    <span className="text-white">Verifying...</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl">💖</span>
                    <span className="text-white">Continue with Love</span>
                    <span className="text-xl">💗</span>
                  </>
                )}
              </button>

              {/* Hint */}
              <div className="mt-6 text-center">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-rose-50 to-pink-50 rounded-full px-5 py-2 border border-rose-200">
                  <span className="text-xl text-rose-500">💡</span>
                  <p className="text-rose-700 font-medium">
                    Hint: It's the name that makes my heart smile
                  </p>
                </div>
              </div>

              {/* Decorative hearts */}
              <div className="mt-6 flex justify-center space-x-3">
                {["💕", "💞", "💓", "💗", "💖"].map((heart, i) => (
                  <span
                    key={i}
                    className="text-2xl opacity-70 hover:opacity-100 hover:scale-125 transition-all duration-300"
                  >
                    {heart}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-5 py-2">
              <span className="text-xl text-rose-500">💝</span>
              <p className="text-rose-700 font-medium">
                Made with love for someone special
              </p>
            </div>
          </div>
          
          {/* Additional floating UI hearts */}
          <div className="fixed top-10 left-10 text-3xl text-rose-300/50 animate-float pointer-events-none">
            ❤️
          </div>
          <div className="fixed top-20 right-10 text-4xl text-pink-300/40 animate-float-slow pointer-events-none" style={{animationDelay: '1s'}}>
            💖
          </div>
          <div className="fixed bottom-20 left-1/4 text-2xl text-rose-400/30 animate-float pointer-events-none" style={{animationDelay: '2s'}}>
            💗
          </div>
          <div className="fixed bottom-32 right-1/4 text-5xl text-pink-400/20 animate-float-slow pointer-events-none" style={{animationDelay: '3s'}}>
            💕
          </div>
        </div>
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(5deg);
          }
        }
        
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-25px) rotate(10deg);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
          20%, 40%, 60%, 80% { transform: translateX(3px); }
        }
        
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 7s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        
        .animate-progress {
          animation: progress 5s linear infinite;
        }
        
        /* Responsive adjustments */
        @media (max-width: 640px) {
          .text-3xl {
            font-size: 1.5rem;
          }
          
          .text-xl {
            font-size: 1.125rem;
          }
          
          .p-8 {
            padding: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}