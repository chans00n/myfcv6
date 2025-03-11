import { Card, CardContent } from "@/components/ui/card"
import { Smile, Meh, Frown, Skull } from "lucide-react"

interface DifficultyIndicatorProps {
  level: "beginner" | "intermediate" | "advanced" | "expert" | "master"
  className?: string
}

export function DifficultyIndicator({ level, className }: DifficultyIndicatorProps) {
  const levels = {
    beginner: {
      label: "Beginner",
      icon: Smile,
      color: "text-green-500",
      description: "Perfect for newcomers to facial fitness",
      activeCount: 1,
    },
    intermediate: {
      label: "Intermediate",
      icon: Smile,
      color: "text-lime-500",
      description: "For those with some facial fitness experience",
      activeCount: 2,
    },
    advanced: {
      label: "Advanced",
      icon: Meh,
      color: "text-yellow-500",
      description: "Challenging workout for regular practitioners",
      activeCount: 3,
    },
    expert: {
      label: "Expert",
      icon: Frown,
      color: "text-orange-500",
      description: "Intense workout for experienced practitioners",
      activeCount: 4,
    },
    master: {
      label: "Master",
      icon: Skull,
      color: "text-red-500",
      description: "Extremely challenging, for dedicated practitioners only",
      activeCount: 5,
    },
  }

  const currentLevel = levels[level] || levels.beginner

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Difficulty Level</h3>
          <span className={`text-sm font-medium ${currentLevel.color}`}>{currentLevel.label}</span>
        </div>
        <div className="flex justify-between mb-2">
          {[...Array(5)].map((_, i) => {
            const Icon = i < currentLevel.activeCount ? Smile : Smile
            return (
              <div
                key={i}
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  i < currentLevel.activeCount
                    ? `${currentLevel.color} opacity-100`
                    : "text-gray-300 dark:text-gray-600 opacity-50"
                }`}
              >
                <Icon className="h-6 w-6" />
              </div>
            )
          })}
        </div>
        <p className="text-sm text-muted-foreground">{currentLevel.description}</p>
      </CardContent>
    </Card>
  )
}

