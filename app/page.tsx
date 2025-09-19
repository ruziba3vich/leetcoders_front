"use client"
import { DonationBanner } from "@/components/donation-banner"
import { UserSearch } from "@/components/user-search"
import { AddUserForm } from "@/components/add-user-form"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Section 1: Donation Banner */}
        <DonationBanner />

        {/* Section 2: User Search */}
        <UserSearch />

        {/* Section 3: Add User Form */}
        <AddUserForm />
      </div>
    </div>
  )
}
