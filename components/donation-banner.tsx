"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"

export function DonationBanner() {
  return (
    <Card className="bg-muted border-accent/20 p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-foreground text-lg font-medium text-balance">Consider donating for the server ➡️</p>
        <Button
          variant="default"
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
          onClick={() => window.open("#", "_blank")}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Donate Now
        </Button>
      </div>
    </Card>
  )
}
