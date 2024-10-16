'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Script from 'next/script'
import { useRouter } from 'next/navigation'
import { useUserStore, usePaymentInfoStore } from "../../../store";

// Placeholder hooks instead of usePaymentAmount and usePromotionalVideoUrlState
const usePaymentAmount = () => ({ paymentAmount: 80 }); // Mock function for paymentAmount
const usePromotionalVideoUrlState = () => ({ promotionalVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }); // Mock function for promotionalVideoUrl

export default function Component() {
  const router = useRouter()
  const [originalPrice] = useState(80)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const playerRef = useRef(null)

  const { paymentAmount } = usePaymentAmount();
  const { promotionalVideoUrl } = usePromotionalVideoUrlState()
  const { paymentInfo, setPaymentAddress, setPaymentToken, setPaymentAmount } =
  usePaymentInfoStore();
  console.log("promotionalVideoUrl", promotionalVideoUrl)
  
  function getVideoID(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)|youtu\.be\/([^?&]+)/;
    const match = url.match(regex);
    return match ? (match[1] || match[2]) : null;
  }

  const promotionalVideoId = getVideoID(promotionalVideoUrl)
  const videoIds = [
    promotionalVideoId
  ]

  useEffect(() => {
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

    window.onYouTubeIframeAPIReady = initializeYouTubePlayer
  }, [])

  const initializeYouTubePlayer = () => {
    const randomVideoId = videoIds[Math.floor(Math.random() * videoIds.length)]

    playerRef.current = new window.YT.Player('youtube-player', {
      height: '360',
      width: '640',
      videoId: randomVideoId,
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      }
    })
  }

  const onPlayerReady = (event) => {
    setVideoLoaded(true)
    event.target.playVideo()
  }

  const onPlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true)
      setTimeout(() => {
        event.target.stopVideo()
        setIsPlaying(false)

        router.push(`/verification`)
      }, 12000)
    } else {
      setIsPlaying(false)
    }
  }

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center p-4">
      <Script src="https://www.youtube.com/iframe_api" />

      <motion.h2
        className="text-3xl font-bold text-green-400 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Original Amount: ${paymentInfo.amount}
      </motion.h2>

      <motion.div
        className="w-full max-w-xl aspect-video bg-gray-800 rounded-lg overflow-hidden shadow-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div id="youtube-player" />
        {!videoLoaded && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-white text-xl">Loading video...</div>
          </div>
        )}
      </motion.div>

      {isPlaying && (
        <motion.div
          className="mt-8 p-6 bg-gray-800 rounded-lg shadow-lg text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-2xl font-bold text-green-400">
            Watch the video to unlock your special discount!
          </p>
        </motion.div>
      )}
    </div>
  )
}
