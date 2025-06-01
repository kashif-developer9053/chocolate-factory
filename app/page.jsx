import Footer from "@/components/footer"
import FeaturedProducts from "@/components/featured-products"
import CategorySection from "@/components/category-section"
import HeroSection from "@/components/hero-section"
import NewsletterSection from "@/components/newsletter-section"
import OurStory from "@/components/our-story"
import SpecialOffers from "@/components/special-offers"
import CustomerReviews from "@/components/customer-reviews"
export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      
      <main className="flex-1">
        <HeroSection />
                <FeaturedProducts />
                <OurStory />

                {/* <SpecialOffers /> */}
                                <CustomerReviews />

        <CategorySection />
        <div className="bg-muted py-16">
          <div className="container">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
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
                      className="h-6 w-6 text-primary"
                    >
                      <path d="M5 12h14"></path>
                      <path d="M12 5v14"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Free Shipping</h3>
                    <p className="text-sm text-muted-foreground">On orders over $100</p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
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
                      className="h-6 w-6 text-primary"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Secure Payments</h3>
                    <p className="text-sm text-muted-foreground">Protected by encryption</p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
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
                      className="h-6 w-6 text-primary"
                    >
                      <path d="M21 10H3"></path>
                      <path d="M21 6H3"></path>
                      <path d="M21 14H3"></path>
                      <path d="M21 18H3"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Easy Returns</h3>
                    <p className="text-sm text-muted-foreground">30 day money back guarantee</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  )
}
