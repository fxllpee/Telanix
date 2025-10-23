import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getProfileImageUrl } from '@/services/api'

interface Person {
  id: number
  name: string
  known_for_department: string
  profile_path: string | null
}

interface PersonCardProps {
  person: Person
  className?: string
}

export const PersonCard = ({ person, className }: PersonCardProps) => {
  return (
    <div className="group block h-full">
      <Card
        className={cn(
          'overflow-hidden bg-card border-accent-1/10 transition-all duration-300 hover:scale-105 h-full flex flex-col items-center text-center p-4',
          className,
        )}
      >
        <CardContent className="p-0 relative flex flex-col items-center">
          <Avatar className="w-32 h-32 border-2 border-accent-1/20">
            <AvatarImage
              src={getProfileImageUrl(person.profile_path, 'h632')}
              alt={person.name}
            />
            <AvatarFallback>
              <User className="w-16 h-16 text-secondary" />
            </AvatarFallback>
          </Avatar>
          <div className="mt-4">
            <h3 className="font-bold truncate text-foreground">
              {person.name}
            </h3>
            <p className="text-sm text-secondary mt-1">
              {person.known_for_department}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
