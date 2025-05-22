import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import MainNav from "@/components/main-nav"
import Footer from "@/components/footer"
import { WheatIcon, CakeIcon, HeartIcon, UsersIcon, LeafIcon, SparklesIcon } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section - Visually Enhanced */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
              alt="Bakery background"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          </div>
          
          <div className="container relative z-10">
            <div className="grid gap-10 md:grid-cols-2 items-center">
              <div className="text-center md:text-left text-white">
                <span className="inline-block px-4 py-1 rounded-full bg-[#C8815F]/20 text-[#C8815F] text-sm font-medium mb-6">Est. 2018</span>
                <h1 className="text-4xl md:text-6xl font-light tracking-wide mb-6 leading-tight">Our <span className="text-[#C8815F]">Story</span></h1>
                <p className="text-lg md:text-xl text-gray-200 max-w-xl mx-auto md:mx-0">
                  Founded with passion and tradition, Chalet Cafe has been Islamabad's beloved bakery since 2018, crafting moments of joy with every delicious bite.
                </p>
                <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
                  <Button asChild size="lg" className="bg-[#C8815F] hover:bg-[#A66B4F] text-white border-none px-8">
                    <Link href="/menu">Our Menu</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white bg-red text-white hover:bg-white/10">
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                </div>
              </div>
              
              <div className="hidden md:block relative h-[500px]">
                <div className="absolute top-0 right-0 h-[400px] w-[80%] rounded-lg overflow-hidden shadow-2xl transform rotate-2 border-8 border-white z-10">
                  <Image
                    src="https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1080&q=80"
                    alt="Our signature breads"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-sm"
                  />
                </div>
                <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full overflow-hidden shadow-xl border-4 border-white transform -rotate-6 z-20">
                  <Image
                    src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
                    alt="Handmade pastries"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 w-full h-8 bg-[#f8f5f2] clip-diagonal z-10"></div>
        </section>

        {/* Our Journey */}
        <section className="bg-[#f8f5f2] py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-center mb-10">
                <span className="h-px bg-[#C8815F]/30 w-12"></span>
                <h2 className="text-3xl md:text-4xl font-light mx-4 text-center text-[#2a201c]">Our Journey</h2>
                <span className="h-px bg-[#C8815F]/30 w-12"></span>
              </div>
              
              <div className="relative border-l-2 border-[#C8815F]/20 pl-8 ml-4 space-y-12">
                <div>
                  <div className="absolute -left-4 w-8 h-8 rounded-full bg-[#C8815F] flex items-center justify-center">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#2a201c] mb-2">The Beginning</h3>
                  <p className="text-gray-600">
                    Chalet Cafe began as a small corner bakery in F-7, Islamabad. Our founder, Maria Ahmed, transformed her 
                    grandmother's handwritten recipes into offerings that quickly attracted a dedicated following of locals and 
                    visitors alike.
                  </p>
                </div>
                
                <div>
                  <div className="absolute -left-4 w-8 h-8 rounded-full bg-[#C8815F] flex items-center justify-center">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#2a201c] mb-2">Growing Together</h3>
                  <p className="text-gray-600">
                    As word spread about our authentic flavors and welcoming atmosphere, we expanded our menu and space. 
                    By 2020, we had opened a second location in F-11, bringing our beloved baked goods to more of the city.
                  </p>
                </div>
                
                <div>
                  <div className="absolute -left-4 w-8 h-8 rounded-full bg-[#C8815F] flex items-center justify-center">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#2a201c] mb-2">Chalet Cafe Today</h3>
                  <p className="text-gray-600">
                    Today, with three locations across Islamabad, we remain committed to our founding principles: 
                    authentic recipes, quality ingredients, and creating a space where people connect over delicious food. 
                    Each day, we bake with the same passion that started our journey.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#C8815F]/5 -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#C8815F]/5 translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="container relative z-10">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 rounded-full bg-[#C8815F]/10 text-[#C8815F] text-sm font-medium mb-4">What We Stand For</span>
              <h2 className="text-3xl md:text-4xl font-light text-[#2a201c]">Our Values</h2>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all border border-gray-100">
                <div className="mb-6 w-14 h-14 rounded-full bg-[#C8815F]/10 flex items-center justify-center">
                  <WheatIcon size={24} className="text-[#C8815F]" />
                </div>
                <h3 className="text-xl font-semibold text-[#2a201c] mb-3">Quality Ingredients</h3>
                <p className="text-gray-600">
                  We source the finest, freshest ingredients to ensure every bite delivers exceptional flavor and quality.
                </p>
              </div>
              <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all border border-gray-100">
                <div className="mb-6 w-14 h-14 rounded-full bg-[#C8815F]/10 flex items-center justify-center">
                  <CakeIcon size={24} className="text-[#C8815F]" />
                </div>
                <h3 className="text-xl font-semibold text-[#2a201c] mb-3">Artisanal Craftsmanship</h3>
                <p className="text-gray-600">
                  Every item is handcrafted with care and attention to detail, honoring both traditional and innovative baking techniques.
                </p>
              </div>
              <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all border border-gray-100">
                <div className="mb-6 w-14 h-14 rounded-full bg-[#C8815F]/10 flex items-center justify-center">
                  <HeartIcon size={24} className="text-[#C8815F]" />
                </div>
                <h3 className="text-xl font-semibold text-[#2a201c] mb-3">Made with Love</h3>
                <p className="text-gray-600">
                  We believe that you can taste the difference when food is made with genuine passion and love for the craft.
                </p>
              </div>
              <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all border border-gray-100">
                <div className="mb-6 w-14 h-14 rounded-full bg-[#C8815F]/10 flex items-center justify-center">
                  <UsersIcon size={24} className="text-[#C8815F]" />
                </div>
                <h3 className="text-xl font-semibold text-[#2a201c] mb-3">Community Focus</h3>
                <p className="text-gray-600">
                  We take pride in being a gathering place for our community, creating a warm, inviting space for connection.
                </p>
              </div>
              <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all border border-gray-100">
                <div className="mb-6 w-14 h-14 rounded-full bg-[#C8815F]/10 flex items-center justify-center">
                  <LeafIcon size={24} className="text-[#C8815F]" />
                </div>
                <h3 className="text-xl font-semibold text-[#2a201c] mb-3">Sustainability</h3>
                <p className="text-gray-600">
                  We're committed to eco-friendly practices, from sourcing local ingredients to using biodegradable packaging.
                </p>
              </div>
              <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all border border-gray-100">
                <div className="mb-6 w-14 h-14 rounded-full bg-[#C8815F]/10 flex items-center justify-center">
                  <SparklesIcon size={24} className="text-[#C8815F]" />
                </div>
                <h3 className="text-xl font-semibold text-[#2a201c] mb-3">Innovation</h3>
                <p className="text-gray-600">
                  While respecting tradition, we're always exploring new flavors, techniques, and creations to delight our customers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 bg-[#f8f5f2]">
          <div className="container">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 rounded-full bg-[#C8815F]/10 text-[#C8815F] text-sm font-medium mb-4">The Faces Behind The Flavors</span>
              <h2 className="text-3xl md:text-4xl font-light text-[#2a201c]">Meet Our Team</h2>
              <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                The passionate people behind Chalet Cafe who pour their hearts into crafting your favorite treats.
              </p>
            </div>
            
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
              <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all">
                <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-[#C8815F]/10">
                  <Image
                    src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
                    alt="Head Baker"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <h3 className="text-lg font-semibold text-[#2a201c]">Maria Ahmed</h3>
                <p className="text-[#C8815F] font-medium mb-3">Founder & Head Baker</p>
                <p className="text-sm text-gray-600">
                  Passionate about preserving traditional Pakistani baking techniques with a modern twist.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all">
                <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-[#C8815F]/10">
                  <Image
                    src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
                    alt="Head Chef"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <h3 className="text-lg font-semibold text-[#2a201c]">Ahmed Khan</h3>
                <p className="text-[#C8815F] font-medium mb-3">Head Chef</p>
                <p className="text-sm text-gray-600">
                  Classically trained chef who brings culinary excellence to our savory menu offerings.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all">
                <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-[#C8815F]/10">
                  <Image
                    src="https://images.unsplash.com/photo-1581299894007-aaa50297cf16?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
                    alt="Pastry Chef"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <h3 className="text-lg font-semibold text-[#2a201c]">Fatima Ali</h3>
                <p className="text-[#C8815F] font-medium mb-3">Pastry Chef</p>
                <p className="text-sm text-gray-600">
                  Artist at heart who creates our stunning specialty cakes and delicate pastries.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all">
                <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-[#C8815F]/10">
                  <Image
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
                    alt="Cafe Manager"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <h3 className="text-lg font-semibold text-[#2a201c]">Omar Shah</h3>
                <p className="text-[#C8815F] font-medium mb-3">Cafe Manager</p>
                <p className="text-sm text-gray-600">
                  Hospitality expert who ensures every guest has a warm, memorable experience at Chalet Cafe.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Image
              src="https://images.unsplash.com/photo-1608198093002-ad4e005484ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
              alt="Bakery background"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-10 border border-gray-100">
              <div className="flex flex-col items-center text-center">
                <div className="text-[#C8815F] mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16.36-.356.083-.586.14l.927-4.04H9.98c.776 0 1.448-.27 2.017-.806.576-.537.863-1.177.863-1.922 0-.915-.354-1.673-1.057-2.27-.7-.596-1.456-.895-2.268-.895-1.3 0-2.37.432-3.205 1.295-.836.864-1.378 2.24-1.626 4.127-.248 1.888-.374 3.705-.374 5.453 0 2.46.398 4.352 1.195 5.676.796 1.323 2.075 1.985 3.84 1.985.798 0 1.5-.127 2.096-.38.596-.25 1.105-.597 1.524-1.038.42-.442.752-.95.994-1.524.243-.574.365-1.172.365-1.794zm-3.75-1.956c.315 0 .597.11.84.337.244.228.367.56.367.998 0 .344-.072.643-.216.894-.144.25-.338.44-.58.565-.243.125-.5.188-.773.188-.367 0-.693-.146-.976-.44-.283-.292-.425-.703-.425-1.23 0-.45.173-.817.52-1.102.345-.285.705-.428 1.076-.428.013 0 .14.6.167.017zm11.54-9.608c-1.312 0-2.378.428-3.193 1.283-.814.856-1.35 2.156-1.608 3.9-.26 1.746-.39 3.473-.39 5.18 0 1.27.094 2.38.28 3.336.188.955.522 1.78 1.004 2.467.48.687 1.13 1.216 1.95 1.585.818.37 1.822.554 3.013.554.784 0 1.482-.127 2.087-.38.604-.255 1.12-.602 1.544-1.038.424-.436.758-.942 1.005-1.512.246-.57.37-1.164.37-1.783 0-.885-.234-1.628-.7-2.228-.466-.6-1.104-.9-1.916-.9-.55 0-1.055.13-1.52.39-.464.258-.846.573-1.14.945.033-.2.038-.345.016-.437-.023-.09-.07-.243-.143-.455l.42-1.58c.156-.625.26-1.172.31-1.642.05-.47.076-.93.076-1.38 0-1-.244-1.834-.728-2.503-.486-.67-1.264-1-2.337-1-.17 0-.356.15-.56.043.204-.65.41-1.296.615-1.938.206-.642.464-1.235.776-1.776h-2.96c-.093.34-.22.757-.384 1.25-.16.494-.33.983-.505 1.467s-.354.938-.534 1.36-.356.798-.534 1.137l-.496 1.137c-.33.073-.08.132-.143.174-.063.043-.116.064-.158.064v1.288c.11 0 .23-.008.352-.026.124-.017.25-.026.38-.026.024 0 .35 0 .33.003z"></path>
                  </svg>
                </div>
                <blockquote className="text-xl md:text-2xl font-light text-[#2a201c] mb-6 italic">
                  Chalet Cafe isn't just a bakery—it's where memories are made. The smell of freshly baked bread, 
                  the warmth of their staff, and the pure joy of biting into their pastries makes this place truly special.
                </blockquote>
                <div className="flex items-center">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
                      alt="Customer"
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-[#2a201c]">Sarah Ahmed</p>
                    <p className="text-sm text-gray-600">Regular Customer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#C8815F] py-16 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-black/5 transform -translate-x-1/3 translate-y-1/3"></div>
          
          <div className="container relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">Ready to taste the difference?</h2>
              <p className="mt-4 text-xl text-white/90">
                Join our community of food lovers who have discovered the authentic flavors of Chalet Cafe.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button asChild size="lg" className="bg-white text-[#C8815F] hover:bg-gray-100 px-8">
                  <Link href="/menu">Browse Our Menu</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white bg-red text-white hover:bg-white/20">
                  <Link href="/contact">Visit Us Today</Link>
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