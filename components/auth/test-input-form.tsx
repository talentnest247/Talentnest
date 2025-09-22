"use client"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestInputForm() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")

  return (
    <div className="min-h-screen bg-white p-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Test Input Form</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="testFirstName">First Name (Text Input)</Label>
            <Input
              id="testFirstName"
              type="text"
              placeholder="Type your first name here"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="border-blue-200"
            />
            <p className="text-sm text-gray-600">You typed: {firstName}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="testLastName">Last Name (Text Input)</Label>
            <Input
              id="testLastName"
              type="text"
              placeholder="Type your last name here"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="border-blue-200"
            />
            <p className="text-sm text-gray-600">You typed: {lastName}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="testEmail">Email (Email Input)</Label>
            <Input
              id="testEmail"
              type="email"
              placeholder="Type your email here"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-blue-200"
            />
            <p className="text-sm text-gray-600">You typed: {email}</p>
          </div>

          <Button type="button" className="w-full">
            Test Button
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}