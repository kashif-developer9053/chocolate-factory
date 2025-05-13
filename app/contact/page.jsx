"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/hooks/use-toast"
import MainNav from "@/components/main-nav"
import Footer from "@/components/footer"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "general",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (value) => {
    setFormData((prev) => ({ ...prev, subject: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      })
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "general",
        message: "",
      })
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <section className="bg-muted py-12 md:py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Contact Us</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Have questions or feedback? We'd love to hear from you. Our team is here to help.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-1">
                <h2 className="text-2xl font-bold">Get in Touch</h2>
                <p className="mt-2 text-muted-foreground">
                  Our friendly team is here to help with any questions or concerns.
                </p>

                <div className="mt-8 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Email Us</h3>
                      <p className="mt-1 text-sm text-muted-foreground">We'll respond within 24 hours</p>
                      <a href="mailto:support@shopease.com" className="mt-1 block text-sm font-medium text-primary">
                        support@shopease.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Call Us</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Mon-Fri from 8am to 5pm</p>
                      <a href="tel:+1-800-123-4567" className="mt-1 block text-sm font-medium text-primary">
                        +1 (800) 123-4567
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Visit Us</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Come say hello at our office</p>
                      <address className="mt-1 not-italic text-sm">
                        123 Commerce Street
                        <br />
                        Suite 500
                        <br />
                        San Francisco, CA 94103
                      </address>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Business Hours</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Our working hours</p>
                      <div className="mt-1 space-y-1 text-sm">
                        <p>Monday - Friday: 8am - 5pm</p>
                        <p>Saturday: 10am - 4pm</p>
                        <p>Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  <h2 className="text-2xl font-bold">Send Us a Message</h2>
                  <p className="mt-2 text-muted-foreground">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number (Optional)</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>What can we help you with?</Label>
                      <RadioGroup
                        value={formData.subject}
                        onValueChange={handleRadioChange}
                        className="grid gap-2 sm:grid-cols-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="general" id="general" />
                          <Label htmlFor="general" className="font-normal">
                            General Inquiry
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="support" id="support" />
                          <Label htmlFor="support" className="font-normal">
                            Customer Support
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="orders" id="orders" />
                          <Label htmlFor="orders" className="font-normal">
                            Orders & Shipping
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="other" id="other" />
                          <Label htmlFor="other" className="font-normal">
                            Other
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="How can we help you?"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container">
            <div className="rounded-lg overflow-hidden border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0968143067466!2d-122.41941492392031!3d37.77492971456982!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c6c8f4459%3A0xb10ed6d9b5050fa5!2sTwitter%20HQ!5e0!3m2!1sen!2sus!4v1685384371264!5m2!1sen!2sus"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="ShopEase Location"
              ></iframe>
            </div>
          </div>
        </section>

        <section className="bg-muted py-12 md:py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
              <p className="mt-4 text-muted-foreground">
                Find quick answers to common questions about our services and policies.
              </p>
              <div className="mt-8 grid gap-4 text-left sm:grid-cols-2">
                <div className="rounded-lg bg-card p-6 shadow-sm">
                  <h3 className="font-semibold">What are your shipping times?</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business day
                    delivery.
                  </p>
                </div>
                <div className="rounded-lg bg-card p-6 shadow-sm">
                  <h3 className="font-semibold">How do I return an item?</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You can initiate a return through your account within 30 days of purchase. We provide free return
                    shipping.
                  </p>
                </div>
                <div className="rounded-lg bg-card p-6 shadow-sm">
                  <h3 className="font-semibold">Do you ship internationally?</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Yes, we ship to over 50 countries worldwide. International shipping typically takes 7-14 business
                    days.
                  </p>
                </div>
                <div className="rounded-lg bg-card p-6 shadow-sm">
                  <h3 className="font-semibold">How can I track my order?</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Once your order ships, you'll receive a tracking number via email. You can also track orders in your
                    account.
                  </p>
                </div>
              </div>
              <div className="mt-8">
                <Button asChild variant="outline">
                  <Link href="/faq">View All FAQs</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
