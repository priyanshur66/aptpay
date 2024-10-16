'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import confetti from 'canvas-confetti'

export default function CelebrationPage() {
  const router = useRouter()

  useEffect(() => {
    
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    }, 250)

   
    const redirectTimer = setTimeout(() => {
      router.push('/pay')  
    }, 5000)  

    return () => {
      clearInterval(interval)
      clearTimeout(redirectTimer)
    }
  }, [router])

  const letterVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: i => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
      },
    }),
  }

  const congratsText = "Payment Done !"

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      
      <motion.div 
        className="absolute w-96 h-96 bg-green-500 rounded-full filter blur-3xl opacity-30"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div 
        className="absolute w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-30"
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      
      <div className="relative z-10 text-center">
        <div className="mb-8 flex justify-center">
          {congratsText.split("").map((letter, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              className="text-7xl font-bold text-white inline-block"
              style={{
                textShadow: '0 0 10px rgba(255,255,255,0.5)',
                marginRight: letter === " " ? "1rem" : "0.1rem"
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.5, type: "spring", stiffness: 200, damping: 10 }}
        >
          <motion.div 
            className="w-20 h-20 bg-green-400 rounded-full mx-auto mb-8 relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <motion.div 
              className="absolute inset-0 flex items-center justify-center text-4xl"
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              🎉
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="text-white text-xl"
        >
          Redirecting you shortly...
        </motion.p>
      </div>
    </div>
  )
}