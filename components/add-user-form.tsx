"use client"

import type React from "react"
import { useState } from "react"

// UI Components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Icons
import { UserPlus, CheckCircle, AlertCircle, Trophy, Code } from "lucide-react"

// Define the User type, mirroring the one from your UserSearch component
interface User {
  id: number
  username: string
  user_slug: string
  real_name: { String: string; Valid: boolean }
  country_code: { String: string; Valid: boolean }
  country_name: { String: string; Valid: boolean }
  total_problems_solved: number
  total_submissions: number
  user_avatar: { String: string; Valid: boolean }
  created_at: string
  updated_at: string
  typename: { String: string; Valid: boolean }
}

// Helper function to get country flag emoji from country code
function getCountryFlag(countryCode: string): string {
  if (!countryCode) return ""
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

export function AddUserForm() {
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [addedUser, setAddedUser] = useState<User | null>(null) // State to hold the new user's data

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username.trim()) {
      setMessage({ type: "error", text: "Please enter a username" })
      return
    }

    setLoading(true)
    setMessage(null)
    setAddedUser(null) // Clear previous result on new submission

    try {
      const response = await fetch("https://backend.leetcoders.uz/api/v1/add-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username.trim() }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: "success", text: "User added successfully!" })
        // Assuming the API returns the user object directly or nested under a key like 'user'
        setAddedUser(data.user || data) 
        setUsername("")
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to add user. Please try again.",
        })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Could not find yourself?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">LeetCode Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your LeetCode username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>

          {message && (
            <Alert variant={message.type === "error" ? "destructive" : "default"}>
              {message.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={loading || !username.trim()} className="bg-primary hover:bg-primary/90">
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Adding...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Add
              </>
            )}
          </Button>
        </form>

        {/* Display the added user's data in a table row on success */}
        {addedUser && (
          <div className="mt-6 border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Avatar</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Real Name</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead className="text-center">Problems Solved</TableHead>
                  <TableHead className="text-center">Total Submissions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow key={addedUser.id} className="bg-muted/50">
                  <TableCell>
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={addedUser.user_avatar?.Valid ? addedUser.user_avatar.String : undefined}
                        alt={addedUser.username}
                      />
                      <AvatarFallback>{addedUser.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{addedUser.username}</TableCell>
                  <TableCell>{addedUser.real_name?.Valid ? addedUser.real_name.String : "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {addedUser.country_code?.Valid && (
                        <span className="text-lg">{getCountryFlag(addedUser.country_code.String)}</span>
                      )}
                      {addedUser.country_name?.Valid ? (
                        <span className="text-sm">{addedUser.country_name.String}</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Unknown</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="text-xs">
                      <Trophy className="w-3 h-3 mr-1" />
                      {addedUser.total_problems_solved}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="text-xs">
                      <Code className="w-3 h-3 mr-1" />
                      {addedUser.total_submissions}
                    </Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
