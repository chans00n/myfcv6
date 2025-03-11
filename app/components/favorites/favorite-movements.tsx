import { Movement } from "@/types"
import { MovementCard } from "@/components/movement-card"

interface FavoriteMovementsProps {
  movements: Movement[]
}

export function FavoriteMovements({ movements }: FavoriteMovementsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {movements.map((movement) => (
        <MovementCard key={movement.id} movement={movement} />
      ))}
    </div>
  )
} 