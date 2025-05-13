import Link from "next/link"
import { Button } from "@/components/ui/button"
import MainNav from "@/components/main-nav"
import Footer from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-muted py-16 md:py-24">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-2 md:gap-12">
              <div className="flex flex-col justify-center">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">About ShopEase</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                  We're on a mission to make online shopping easier, more affordable, and more enjoyable for everyone.
                </p>
                <div className="mt-8">
                  <Button asChild size="lg">
                    <Link href="/products">Shop Now</Link>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1573855619003-97b4799dcd8b?q=80&w=1080&auto=format&fit=crop"
                  alt="Our team at work"
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Story</h2>
              <p className="mt-6 text-lg text-muted-foreground">
                ShopEase was founded in 2018 with a simple idea: make online shopping better. We started as a small team
                of e-commerce enthusiasts who were frustrated with the complicated and often disappointing experience of
                shopping online.
              </p>
              <p className="mt-4 text-lg text-muted-foreground">
                What began as a small operation has grown into a thriving marketplace with thousands of products and
                customers across the country. Despite our growth, we've stayed true to our core values: quality,
                affordability, and exceptional customer service.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-muted py-16 md:py-24">
          <div className="container">
            <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">Our Values</h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-card p-8 shadow-sm">
                <div className="mb-4 rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Quality First</h3>
                <p className="mt-2 text-muted-foreground">
                  We carefully curate our product selection to ensure everything we sell meets our high standards.
                </p>
              </div>
              <div className="rounded-lg bg-card p-8 shadow-sm">
                <div className="mb-4 rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Customer Obsession</h3>
                <p className="mt-2 text-muted-foreground">
                  Our customers are at the heart of everything we do. We're committed to providing exceptional service.
                </p>
              </div>
              <div className="rounded-lg bg-card p-8 shadow-sm">
                <div className="mb-4 rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M12 22v-5"></path>
                    <path d="M9 8V2"></path>
                    <path d="M15 8V2"></path>
                    <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Innovation</h3>
                <p className="mt-2 text-muted-foreground">
                  We're constantly looking for ways to improve our platform and bring new, exciting products to our
                  customers.
                </p>
              </div>
              <div className="rounded-lg bg-card p-8 shadow-sm">
                <div className="mb-4 rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"></path>
                    <path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"></path>
                    <path d="M4 15v-3a6 6 0 0 1 6-6h0"></path>
                    <path d="M14 6h0a6 6 0 0 1 6 6v3"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Accessibility</h3>
                <p className="mt-2 text-muted-foreground">
                  We believe everyone should have access to quality products at fair prices, no matter where they live.
                </p>
              </div>
              <div className="rounded-lg bg-card p-8 shadow-sm">
                <div className="mb-4 rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M3 6v18h18V6"></path>
                    <path d="M3 6V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v3"></path>
                    <path d="M3 6h18"></path>
                    <path d="M10 11v5"></path>
                    <path d="M14 11v5"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Sustainability</h3>
                <p className="mt-2 text-muted-foreground">
                  We're committed to reducing our environmental impact through eco-friendly packaging and practices.
                </p>
              </div>
              <div className="rounded-lg bg-card p-8 shadow-sm">
                <div className="mb-4 rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M17 6.1H3"></path>
                    <path d="M21 12.1H3"></path>
                    <path d="M15.1 18H3"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Transparency</h3>
                <p className="mt-2 text-muted-foreground">
                  We believe in being open and honest with our customers about our products, pricing, and policies.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 md:py-24">
          <div className="container">
            <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">Meet Our Team</h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
              The passionate people behind ShopEase who work tirelessly to bring you the best shopping experience.
            </p>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <div className="text-center">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&auto=format&fit=crop"
                  alt="CEO"
                  className="mx-auto h-32 w-32 rounded-full object-cover"
                />
                <h3 className="mt-4 text-lg font-semibold">Michael Chen</h3>
                <p className="text-sm text-primary">CEO & Founder</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  E-commerce veteran with 15+ years of experience in retail and technology.
                </p>
              </div>
              <div className="text-center">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop"
                  alt="COO"
                  className="mx-auto h-32 w-32 rounded-full object-cover"
                />
                <h3 className="mt-4 text-lg font-semibold">Sarah Johnson</h3>
                <p className="text-sm text-primary">COO</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Operations expert who ensures everything runs smoothly behind the scenes.
                </p>
              </div>
              <div className="text-center">
                <img
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&auto=format&fit=crop"
                  alt="CTO"
                  className="mx-auto h-32 w-32 rounded-full object-cover"
                />
                <h3 className="mt-4 text-lg font-semibold">David Kim</h3>
                <p className="text-sm text-primary">CTO</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Tech guru who leads our development team and keeps our platform running flawlessly.
                </p>
              </div>
              <div className="text-center">
                <img
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&auto=format&fit=crop"
                  alt="CMO"
                  className="mx-auto h-32 w-32 rounded-full object-cover"
                />
                <h3 className="mt-4 text-lg font-semibold">Emily Rodriguez</h3>
                <p className="text-sm text-primary">CMO</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Creative marketer who helps us connect with customers and build our brand.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary py-16 text-primary-foreground">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to start shopping?</h2>
              <p className="mt-4 text-lg opacity-90">
                Join thousands of satisfied customers who have discovered the ShopEase difference.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/products">Browse Products</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                  <Link href="/contact">Contact Us</Link>
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
