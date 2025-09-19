import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Users, Star, BookOpen } from "lucide-react"
import type { Skill, Artisan } from "@/lib/types"
import Link from "next/link"

interface SkillCardProps {
  skill: Skill
  artisan?: Artisan
  showArtisan?: boolean
}

export function SkillCard({ skill, artisan, showArtisan = true }: SkillCardProps) {
  const spotsLeft = skill.maxStudents - skill.currentStudents
  const isFullyBooked = spotsLeft <= 0

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">{skill.title}</CardTitle>
            <div className="flex items-center space-x-2 mt-2">
              <Badge {...({ variant: "outline" } as any)} className="text-xs">
                {skill.category}
              </Badge>
              <Badge
                {...({ variant: 
                  skill.difficulty === "beginner"
                    ? "secondary"
                    : skill.difficulty === "intermediate"
                      ? "default"
                      : "destructive"
                } as any)}
                className="text-xs"
              >
                {skill.difficulty}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-unilorin-purple">₦{skill.price.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">{skill.duration}</p>
          </div>
        </div>

        {showArtisan && artisan && (
          <div className="flex items-center space-x-3 mt-4 pt-4 border-t">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={artisan.profileImage || "/placeholder.svg"}
                alt={`${artisan.firstName} ${artisan.lastName}`}
              />
              <AvatarFallback className="bg-unilorin-purple text-white text-xs">
                {artisan.firstName[0]}
                {artisan.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {artisan.firstName} {artisan.lastName}
              </p>
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-muted-foreground">
                  {artisan.rating} ({artisan.totalReviews})
                </span>
              </div>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">{skill.description}</p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{skill.duration}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>
              {skill.currentStudents}/{skill.maxStudents} enrolled
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span>{skill.syllabus.length} modules</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              {...({ variant: isFullyBooked ? "destructive" : spotsLeft <= 3 ? "secondary" : "outline" } as any)}
              className="text-xs"
            >
              {isFullyBooked ? "Full" : `${spotsLeft} spots left`}
            </Badge>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        <div className="flex space-x-2 w-full">
          <Button {...({ variant: "outline", size: "sm" } as any)} className="flex-1 bg-transparent" asChild>
            <Link href={`/skills/${skill.id}`}>View Details</Link>
          </Button>
          <Button {...({ size: "sm" } as any)} className="flex-1" disabled={isFullyBooked} asChild={!isFullyBooked}>
            {isFullyBooked ? "Fully Booked" : <Link href={`/skills/${skill.id}/enroll`}>Enroll Now</Link>}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
