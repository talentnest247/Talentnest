"use client"

import { useState } from "react"
import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, ThumbsUp, MessageSquare, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface Review {
  id: string
  studentName: string
  studentAvatar?: string
  rating: number
  title: string
  comment: string
  date: string
  verified: boolean
  helpful: number
  serviceName: string
}

interface ReviewSystemProps {
  providerId?: string
  artisanId?: string
  reviews: Review[]
  onAddReview?: (review: Omit<Review, "id" | "date" | "helpful">) => void
  canReview?: boolean
  userHasReviewed?: boolean
}

export function ReviewSystem({ 
  reviews, 
  onAddReview, 
  canReview = false, 
  userHasReviewed = false 
}: ReviewSystemProps) {
  const [isWritingReview, setIsWritingReview] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: "",
    comment: "",
    serviceName: ""
  })

  // Progress bar component to avoid inline styles
  const ProgressBar = ({ percentage }: { percentage: number }) => {
    const getWidthClass = (percent: number) => {
      if (percent === 0) return "w-0"
      if (percent <= 5) return "w-[5%]"
      if (percent <= 10) return "w-[10%]"
      if (percent <= 15) return "w-[15%]"
      if (percent <= 20) return "w-[20%]"
      if (percent <= 25) return "w-[25%]"
      if (percent <= 30) return "w-[30%]"
      if (percent <= 35) return "w-[35%]"
      if (percent <= 40) return "w-[40%]"
      if (percent <= 45) return "w-[45%]"
      if (percent <= 50) return "w-[50%]"
      if (percent <= 55) return "w-[55%]"
      if (percent <= 60) return "w-[60%]"
      if (percent <= 65) return "w-[65%]"
      if (percent <= 70) return "w-[70%]"
      if (percent <= 75) return "w-[75%]"
      if (percent <= 80) return "w-[80%]"
      if (percent <= 85) return "w-[85%]"
      if (percent <= 90) return "w-[90%]"
      if (percent <= 95) return "w-[95%]"
      return "w-full"
    }

    return (
      <div className="flex-1 bg-gray-200 rounded-full h-2 relative overflow-hidden">
        <div className={cn(
          "bg-blue-500 h-2 rounded-full transition-all duration-300 absolute top-0 left-0",
          getWidthClass(percentage)
        )} />
      </div>
    )
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0

  const ratingCounts = [5, 4, 3, 2, 1].map(rating => 
    reviews.filter(review => review.rating === rating).length
  )

  const handleSubmitReview = () => {
    if (!onAddReview || newReview.rating === 0 || !newReview.comment.trim()) return

    onAddReview({
      studentName: "Current User", // Would be filled from auth context
      rating: newReview.rating,
      title: newReview.title,
      comment: newReview.comment,
      verified: true,
      serviceName: newReview.serviceName
    })

    setNewReview({ rating: 0, title: "", comment: "", serviceName: "" })
    setIsWritingReview(false)
  }

  const StarRating = ({ rating, size = "sm", interactive = false, onChange }: {
    rating: number
    size?: "sm" | "md" | "lg"
    interactive?: boolean
    onChange?: (rating: number) => void
  }) => {
    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-5 w-5", 
      lg: "h-6 w-6"
    }

    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              sizeClasses[size],
              star <= rating 
                ? "fill-yellow-400 text-yellow-400" 
                : "text-gray-300",
              interactive && "cursor-pointer hover:text-yellow-400"
            )}
            onClick={() => interactive && onChange?.(star)}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6 bg-white">
      {/* Reviews Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-700 flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Reviews & Ratings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Overall Rating */}
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-blue-700">{averageRating.toFixed(1)}</div>
              <StarRating rating={averageRating} size="lg" />
              <p className="text-sm text-gray-600">{reviews.length} reviews</p>
            </div>

            {/* Rating Breakdown */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating, index) => {
                const percentage = reviews.length > 0 
                  ? (ratingCounts[index] / reviews.length) * 100 
                  : 0
                return (
                <div key={rating} className="flex items-center space-x-2">
                  <span className="text-sm w-3 text-blue-700">{rating}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <ProgressBar percentage={percentage} />
                  <span className="text-sm text-gray-600 w-8">{ratingCounts[index]}</span>
                </div>
              )})}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Write Review */}
      {canReview && !userHasReviewed && (
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-700">Write a Review</CardTitle>
          </CardHeader>
          <CardContent>
            {!isWritingReview ? (
              <Button 
                onClick={() => setIsWritingReview(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Write Review
              </Button>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label className="text-blue-700">Rating *</Label>
                  <StarRating 
                    rating={newReview.rating} 
                    size="lg" 
                    interactive 
                    onChange={(rating) => setNewReview(prev => ({ ...prev, rating }))}
                  />
                </div>

                <div>
                  <Label htmlFor="reviewTitle" className="text-blue-700">Review Title</Label>
                  <input
                    id="reviewTitle"
                    placeholder="Summarize your experience"
                    value={newReview.title}
                    onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-2 border border-blue-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <Label htmlFor="reviewComment" className="text-blue-700">Your Review *</Label>
                  <Textarea
                    id="reviewComment"
                    placeholder="Share your experience with this service provider..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    className="min-h-[100px] border-blue-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex space-x-2">
                  <Button 
                    onClick={handleSubmitReview}
                    disabled={newReview.rating === 0 || !newReview.comment.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Submit Review
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsWritingReview(false)}
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={review.studentAvatar} alt={review.studentName} />
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    {review.studentName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-blue-700">{review.studentName}</h4>
                      <div className="flex items-center space-x-2">
                        <StarRating rating={review.rating} size="sm" />
                        {review.verified && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{review.date}</span>
                      </div>
                    </div>
                  </div>

                  {review.title && (
                    <h5 className="font-medium text-gray-900">{review.title}</h5>
                  )}

                  <p className="text-gray-700">{review.comment}</p>

                  {review.serviceName && (
                    <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
                      {review.serviceName}
                    </Badge>
                  )}

                  <div className="flex items-center space-x-4 pt-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-500 hover:text-blue-700 h-8 px-2"
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      Helpful ({review.helpful})
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {reviews.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No reviews yet. Be the first to review this service provider!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}