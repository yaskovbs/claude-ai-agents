'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const backgroundImages = [
  {
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Leonardo_Phoenix_10_A_futuristic_illustration_depicting_a_team_0.jpg-dxYDP2lWcGmFo9I2DALRzH14R4wfjG.jpeg",
    alt: "AI agents working at digital interfaces with sunset view"
  },
  {
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Leonardo_Phoenix_10_A_futuristic_illustration_depicting_a_team_1.jpg-j3O8066ToEjtXPuHw00UC2JDNdCruj.jpeg",
    alt: "AI team collaborating on digital projects with city skyline"
  },
  {
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Leonardo_Phoenix_10_A_futuristic_illustration_depicting_a_team_0%20%281%29.jpg-th0abl8ULnqqPy27Ue8pt5Az0T2O5S.jpeg",
    alt: "Four AI entities working together at a digital table"
  },
  {
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Leonardo_Phoenix_10_A_futuristic_illustration_depicting_a_team_1%20%281%29.jpg-gqd3PYofdU8vWrVLVvpwRb5o6jD2nO.jpeg",
    alt: "AI team meeting with holographic displays"
  }
]

export default function BackgroundCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-rotate images every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length)
    }, 8000)
    
    return () => clearInterval(interval)
  }, [])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? backgroundImages.length - 1 : prevIndex - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % backgroundImages.length
    )
  }

  return (
    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-lg">
      {backgroundImages.map((image, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="relative w-full h-full">
            <Image
              src={image.url || "/placeholder.svg"}
              alt={image.alt}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/30 bg-gradient-to-t from-black/70 to-transparent"></div>
          </div>
        </div>
      ))}
      
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full"
        onClick={goToPrevious}
        aria-label="Previous image"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full"
        onClick={goToNext}
        aria-label="Next image"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  )
}

