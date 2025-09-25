"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Trophy, Code, ChevronLeft, ChevronRight } from "lucide-react"
import { CountrySelector } from "@/components/country-selector"
import { Skeleton } from "@/components/ui/skeleton"

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

interface UsersResponse {
  users: User[]
  total_count: number
  page: number
  limit: number
}

const UserTableSkeleton = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-5 w-48" />
    </div>
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-center">#</TableHead>
            <TableHead className="w-16">Avatar</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Real Name</TableHead>
            <TableHead>Country</TableHead>
            <TableHead className="text-center">Problems Solved</TableHead>
            <TableHead className="text-center">Total Submissions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i} className="hover:bg-transparent">
              <TableCell className="text-center">
                <Skeleton className="h-5 w-6 mx-auto" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-10 h-10 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-40" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-24" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-5 w-16 mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-5 w-16 mx-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    <div className="flex items-center justify-between">
      <Skeleton className="h-9 w-24" />
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-9 w-24" />
    </div>
  </div>
)

export function UserSearch() {
  const [selectedCountry, setSelectedCountry] = useState("all")
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasSearched, setHasSearched] = useState(false)

  const fetchUsers = async (country: string, page = 1) => {
    setLoading(true)
    try {
      const response = await fetch(
        `https://backend.leetcoders.uz/api/v1/get-users?country=${country}&page=${page}&limit=100`,
      )
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }
      const data: UsersResponse = await response.json()

      if (data && Array.isArray(data.users)) {
        setUsers(data.users)
        // Ensure total_count is a number and use the page number from the API response
        setTotalCount(Number(data.total_count) || 0)
        setCurrentPage(data.page || page)
      } else {
        setUsers([])
        setTotalCount(0)
        console.error("Unexpected API response structure:", data)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      setUsers([])
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setHasSearched(true)
    // Always reset to page 1 for a new search
    fetchUsers(selectedCountry, 1)
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      fetchUsers(selectedCountry, currentPage - 1)
    }
  }

  const handleNextPage = () => {
    const totalPages = Math.ceil(totalCount / 100)
    if (currentPage < totalPages) {
      fetchUsers(selectedCountry, currentPage + 1)
    }
  }

  const totalPages = Math.ceil(totalCount / 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Search LeetCode Users
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Country Selector and Search Button */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <CountrySelector value={selectedCountry} onValueChange={setSelectedCountry} />
          </div>
          <Button onClick={handleSearch} disabled={loading} className="bg-primary hover:bg-primary/90">
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Search Users
              </>
            )}
          </Button>
        </div>

        {/* Results Area */}
        {loading && <UserTableSkeleton />}

        {!loading && hasSearched && users.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            <p>No users found for the selected country.</p>
          </div>
        )}

        {!loading && users.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Found {totalCount} users (Page {currentPage} of {totalPages})
              </p>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center">#</TableHead>
                    <TableHead className="w-16">Avatar</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Real Name</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead className="text-center">Problems Solved</TableHead>
                    <TableHead className="text-center">Total Submissions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user, index) => (
                    <TableRow key={user.id} className="hover:bg-muted/50">
                      <TableCell className="text-center font-medium text-muted-foreground">
                        {(currentPage - 1) * 100 + index + 1}
                      </TableCell>
                      <TableCell>
                        <Avatar className="w-10 h-10">
                          <AvatarImage
                            src={user.user_avatar?.Valid ? user.user_avatar.String : undefined}
                            alt={user.username}
                          />
                          <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.real_name?.Valid ? user.real_name.String : "-"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {user.country_code?.Valid && (
                            <span className="text-lg">{getCountryFlag(user.country_code.String)}</span>
                          )}
                          {user.country_name?.Valid ? (
                            <span className="text-sm">{user.country_name.String}</span>
                          ) : (
                            <span className="text-sm text-muted-foreground">Unknown</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="text-xs">
                          <Trophy className="w-3 h-3 mr-1" />
                          {user.total_problems_solved}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="text-xs">
                          <Code className="w-3 h-3 mr-1" />
                          {user.total_submissions}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePreviousPage}
                disabled={currentPage <= 1 || loading}
                className="flex items-center gap-2 bg-transparent"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>

              <Button
                variant="outline"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages || loading}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function getCountryFlag(countryCode: string): string {
  if (!countryCode) return ""
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}
