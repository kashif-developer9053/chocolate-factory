"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HeroSection() {
  const [checkinDate, setCheckinDate] = useState("Sun, 20 May 2025")
  const [checkoutDate, setCheckoutDate] = useState("Mon, 21 May 2025")
  const [guests, setGuests] = useState("2 Adults")
  
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
        style={{ 
          backgroundImage: 'url("images/bg.jpg")',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      </div>
      
      {/* Content container */}
      <div className="container relative z-10">
        <div className="grid gap-10 md:grid-cols-2 items-center">
          <div className="text-center md:text-left text-white">
            <span className="inline-block px-4 py-1 rounded-full bg-[#C8815F]/20 text-[#C8815F] text-sm font-medium mb-6">Est. 2018</span>
            <h1 className="text-4xl md:text-6xl font-light tracking-wide mb-6 leading-tight">
              Your Sweet <span className="text-[#C8815F]">Treat</span> Awaits
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-xl mx-auto md:mx-0 mb-8">
              Discover joy in every bite at The Chocolates Factory, where we bring the world’s finest chocolates and snacks to your doorstep since 2018.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Button asChild  className="bg-[#C8815F] hover:bg-[#A66B4F] border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 px-8 py-3 rounded-full text-lg font-medium tracking-wider uppercase">
                <Link href="/products">Shop Now</Link>
              </Button>
              <Button asChild  variant="outline" className="bg-black hover:bg-[#A66B4F] border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 px-8 py-3 rounded-full text-lg font-medium tracking-wider uppercase">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom stats */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm py-8 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between text-center md:text-left">
            <div className="mb-6 md:mb-0">
              <p className="text-white font-bold text-4xl">5K+</p>
              <p className="text-white/80 text-sm">Happy Customers</p>
            </div>
            <div className="mb-6 md:mb-0">
              <p className="text-white font-bold text-4xl">50+</p>
              <p className="text-white/80 text-sm">Delicious Items</p>
            </div>
            <div>
              <p className="text-white font-bold text-4xl">10+</p>
              <p className="text-white/80 text-sm">Years of Excellence</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}