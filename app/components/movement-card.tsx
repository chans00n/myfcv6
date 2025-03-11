"use client"

import { Movement } from "@/types"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useFavorites } from "@/context/favorites-context"

interface MovementCardProps {
  movement: Movement
}

export function MovementCard({ movement }: MovementCardProps) {
  const { toggleMovementFavorite } = useFavorites()

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative aspect-video">
          <Image
            src={movement.thumbnail}
            alt={movement.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
            onClick={() => toggleMovementFavorite(movement)}
          >
            <Heart
              className={`h-4 w-4 ${movement.isFavorite ? "fill-current text-red-500" : "text-muted-foreground"}`}
            />
            <span className="sr-only">Toggle favorite</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2.5 p-4">
        <Badge variant="secondary" className="w-fit">
          {movement.category}
        </Badge>
        <h3 className="line-clamp-1 text-lg font-semibold">{movement.title}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{movement.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/movements/${movement.id}`}>View movement</Link>
        </Button>
      </CardFooter>
    </Card>
  )
} 