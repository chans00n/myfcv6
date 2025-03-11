"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

// Collection of inspirational quotes related to fitness, wellness, and personal growth
const quotes = [
  {
    text: "The face is the mirror of the mind, and eyes without speaking confess the secrets of the heart.",
    author: "St. Jerome",
  },
  {
    text: "Your face is a book where your history is written.",
    author: "James Ellis",
  },
  {
    text: "Beauty begins the moment you decide to be yourself.",
    author: "Coco Chanel",
  },
  {
    text: "The most beautiful thing you can wear is confidence.",
    author: "Blake Lively",
  },
  {
    text: "Smile, it's the key that fits the lock of everybody's heart.",
    author: "Anthony J. D'Angelo",
  },
  {
    text: "The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart.",
    author: "Helen Keller",
  },
  {
    text: "The face is the index of the mind.",
    author: "Ancient Proverb",
  },
  {
    text: "Your face makes up less than 10% of your body surface but it tells the most about who you are.",
    author: "Dr. David Matsumoto",
  },
  {
    text: "The most powerful weapon on earth is the human soul on fire.",
    author: "Ferdinand Foch",
  },
  {
    text: "Consistency is what transforms average into excellence.",
    author: "Unknown",
  },
  {
    text: "Small daily improvements are the key to staggering long-term results.",
    author: "Unknown",
  },
  {
    text: "The only bad workout is the one that didn't happen.",
    author: "Unknown",
  },
  {
    text: "Your body hears everything your mind says.",
    author: "Naomi Judd",
  },
  {
    text: "Take care of your body. It's the only place you have to live.",
    author: "Jim Rohn",
  },
  {
    text: "The difference between who you are and who you want to be is what you do.",
    author: "Unknown",
  },
]

export function InspirationalQuote() {
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(null)

  useEffect(() => {
    // Select a random quote when the component mounts
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setQuote(quotes[randomIndex])
  }, [])

  if (!quote) return null

  return (
    <Card className="bg-primary/5 border-none">
      <CardContent className="pt-6 px-6 pb-6 flex items-start">
        <Quote className="h-8 w-8 text-primary/40 mr-4 mt-1 flex-shrink-0" />
        <div>
          <p className="text-lg italic mb-2">{quote.text}</p>
          <p className="text-sm text-muted-foreground text-right">— {quote.author}</p>
        </div>
      </CardContent>
    </Card>
  )
}

