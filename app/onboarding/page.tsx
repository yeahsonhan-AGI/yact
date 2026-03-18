'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'

const slides = [
  {
    id: 1,
    title: 'Record Your Adventures',
    titleZh: '记录你的探险',
    description: 'Document every moment of your outdoor journey with photos, stories, and memories that last forever.',
    descriptionZh: '用照片、故事和永恒的回忆记录你户外探险的每一刻。',
    gradient: 'from-emerald-500 to-teal-600',
    icon: '🏔️'
  },
  {
    id: 2,
    title: 'Join a Team',
    titleZh: '加入队伍',
    description: 'Connect with fellow adventurers, create groups, and plan your next expedition together.',
    descriptionZh: '与志同道合的探险者联系，组建团队，共同规划下一次远征。',
    gradient: 'from-blue-500 to-indigo-600',
    icon: '🧭'
  },
  {
    id: 3,
    title: 'Share with Community',
    titleZh: '与社区分享',
    description: 'Inspire others by sharing your experiences and discover amazing adventures from our community.',
    descriptionZh: '通过分享你的经历来启发他人，并从社区中发现精彩的探险故事。',
    gradient: 'from-orange-500 to-pink-600',
    icon: '🌄'
  },
  {
    id: 4,
    title: 'Split Expenses Easily',
    titleZh: '轻松分摊费用',
    description: 'Track group expenses fairly and transparently. No more awkward money conversations.',
    descriptionZh: '公平透明地追踪团队费用。不再有尴尬的金钱谈话。',
    gradient: 'from-purple-500 to-violet-600',
    icon: '💰'
  }
]

// Set cookie that persists for 1 year
function setOnboardingComplete() {
  const date = new Date()
  date.setFullYear(date.getFullYear() + 1)
  document.cookie = `onboarding-complete=true; expires=${date.toUTCString()}; path=/`
}

export default function OnboardingPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const router = useRouter()
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setDirection(1)
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setDirection(-1)
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleSkip = () => {
    setOnboardingComplete()
    router.push('/')
  }

  const handleGetStarted = () => {
    setOnboardingComplete()
    router.push('/')
  }

  // Touch handling for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current
    const threshold = 50

    if (diff > threshold) {
      // Swiped left, go next
      handleNext()
    } else if (diff < -threshold) {
      // Swiped right, go previous
      handlePrevious()
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'ArrowLeft') handlePrevious()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8] to-[#E8E0D0] relative overflow-hidden">
      {/* Skip button */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 z-20 text-sm font-medium text-[#3D2914]/70 hover:text-[#3D2914] transition-colors"
      >
        Skip
      </button>

      {/* Carousel Container */}
      <div
        className="h-screen flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-full max-w-lg mx-auto px-6">
          {/* Slide */}
          <div
            key={currentIndex}
            className="transition-all duration-500 ease-out"
            style={{
              transform: `translateX(${direction * -20}px)`,
              opacity: direction === 0 ? 1 : 0.8,
            }}
            onAnimationEnd={() => setDirection(0)}
          >
            {/* Card */}
            <div className={`bg-gradient-to-br ${slides[currentIndex].gradient} rounded-3xl p-8 shadow-2xl min-h-[520px] flex flex-col justify-between text-white relative overflow-hidden`}>
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
              </div>

              {/* Icon */}
              <div className="relative z-10 text-center">
                <div className="text-8xl mb-6 animate-bounce" style={{ animationDuration: '3s' }}>
                  {slides[currentIndex].icon}
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10 text-center space-y-4">
                <h2 className="text-3xl font-bold">
                  {slides[currentIndex].title}
                </h2>
                <p className="text-lg text-white/90">
                  {slides[currentIndex].description}
                </p>
              </div>

              {/* Decorative element */}
              <div className="relative z-10 flex justify-center">
                <div className="w-16 h-1 bg-white/30 rounded-full" />
              </div>
            </div>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center items-center gap-3 mt-8">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1)
                  setCurrentIndex(index)
                }}
                className={`transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 h-3 bg-[#3D2914] rounded-full'
                    : 'w-3 h-3 bg-[#3D2914]/30 rounded-full hover:bg-[#3D2914]/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8 gap-4">
            {/* Previous button */}
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={`p-3 rounded-full transition-all ${
                currentIndex === 0
                  ? 'text-[#3D2914]/20 cursor-not-allowed'
                  : 'text-[#3D2914] hover:bg-[#3D2914]/10'
              }`}
              aria-label="Previous slide"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Get Started button */}
            <button
              onClick={handleGetStarted}
              className="flex-1 bg-[#3D2914] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#3D2914]/90 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Next button alternative */}
            <button
              onClick={handleNext}
              disabled={currentIndex === slides.length - 1}
              className={`p-3 rounded-full transition-all ${
                currentIndex === slides.length - 1
                  ? 'text-[#3D2914]/20 cursor-not-allowed'
                  : 'text-[#3D2914] hover:bg-[#3D2914]/10'
              }`}
              aria-label="Next slide"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Slide counter */}
          <p className="text-center text-sm text-[#3D2914]/60 mt-6">
            {currentIndex + 1} of {slides.length}
          </p>
        </div>
      </div>
    </div>
  )
}
