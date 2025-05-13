import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-[#8B4513] to-[#D2691E] py-20 text-white">
      <div className="container relative z-10">
        <div className="grid gap-6 md:grid-cols-2 md:gap-12 lg:grid-cols-5">
          <div className="flex flex-col justify-center space-y-4 lg:col-span-3">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Indulge in Chocolate Perfection
              </h1>
              <p className="max-w-[600px] text-muted-100 md:text-xl">
                Discover our artisanal chocolates and confections, handcrafted with love and the finest ingredients.
                Free shipping on orders over $50.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg" className="bg-white text-[#8B4513] hover:bg-gray-100">
                <Link href="/products">Shop Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/20">
                <Link href="/categories">Browse Categories</Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:block lg:col-span-2">
            <div className="aspect-[4/3] overflow-hidden rounded-lg bg-white/10 backdrop-blur-sm">
              <img
                src="https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=1080&auto=format&fit=crop"
                alt="Delicious chocolate truffles and confections"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
    </section>
  )
}
