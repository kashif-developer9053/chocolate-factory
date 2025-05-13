"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"

export default function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setEmail("")
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
      })
    }, 1000)
  }

  return (
    <section className="bg-primary/5 py-12 md:py-16 lg:py-20">
      <div className="container">
        <div className="mx-auto max-w-[800px] text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">Subscribe to Our Newsletter</h2>
          <p className="mt-4 text-muted-foreground">
            Stay updated with our latest products, exclusive offers, and promotions.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-2 sm:flex-row sm:gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              className="sm:min-w-[300px]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
          <p className="mt-2 text-xs text-muted-foreground">
            By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
          </p>
        </div>
      </div>
    </section>
  )
}
