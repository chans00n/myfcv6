import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare } from "lucide-react"

interface CoachProfileProps {
  coach: {
    name: string
    image?: string
    bio: string
    specialty: string
  }
}

export function CoachProfile({ coach }: CoachProfileProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="relative">
          <div className="bg-gradient-to-r from-primary/20 to-primary/10 h-24 rounded-t-lg"></div>
          <Avatar className="absolute -bottom-12 left-4 h-24 w-24 border-4 border-background">
            <AvatarImage
              src="https://framerusercontent.com/images/ay6e6ZFLzTofdNgtbAbL7rOY.jpg"
              alt={coach.name}
              className="object-cover"
            />
            <AvatarFallback className="text-2xl bg-primary/20">{coach.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>

        <div className="pt-14 px-4 pb-4">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{coach.name}</h3>
              <Badge variant="outline" className="bg-primary/10">
                Coach
              </Badge>
            </div>
            <Badge variant="secondary" className="mt-1">
              {coach.specialty}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground mb-4">{coach.bio}</p>

          <Button variant="outline" className="w-full gap-2">
            <MessageSquare className="h-4 w-4" />
            Message Coach
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

