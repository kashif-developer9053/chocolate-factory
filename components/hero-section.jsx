"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  const [checkinDate, setCheckinDate] = useState("Sun, 20 May 2025")
  const [checkoutDate, setCheckoutDate] = useState("Mon, 21 May 2025")
  const [guests, setGuests] = useState("2 Adults")

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Full-sized background image - bakery themed */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Content container with vertical centering */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-white px-4 md:px-8">
        {/* Main heading - large elegant font */}
        <h1 className="text-5xl md:text-7xl font-light tracking-wider text-center mb-4 uppercase">
          THE BEST LUXURY<br />BAKERY
        </h1>
        
        {/* Funky catchphrases */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 text-center">
          <p className="text-xl italic bg-black/30 px-4 py-2 rounded-full">Baked with love, served with style</p>
          <p className="text-xl italic bg-black/30 px-4 py-2 rounded-full">Where every bite tells a story</p>
          <p className="text-xl italic bg-black/30 px-4 py-2 rounded-full">Life is sweet at Chalet Cafe</p>
        </div>
        
        {/* Subheading */}
        <p className="text-xl md:text-2xl text-center mb-16 font-light">
          Discover pure indulgence in every bite at our bakery.
        </p>
        
        {/* Booking widget */}
        <div className="bg-white/20 backdrop-blur-md rounded-lg p-2 w-full max-w-4xl">
          <div className="flex flex-col md:flex-row">
            {/* Visit Date */}
            <div className="flex-1 border-r border-white/20 p-4">
              <div className="text-white mb-2">Visit Date</div>
              <div className="text-white/80 text-sm">{checkinDate}</div>
            </div>
            
            {/* Order Time */}
            <div className="flex-1 md:border-r border-white/20 p-4">
              <div className="text-white mb-2">Pickup Time</div>
              <div className="text-white/80 text-sm">Between 10AM - 8PM</div>
            </div>
            
            {/* Party Size */}
            <div className="flex-1 border-r border-white/20 p-4">
              <div className="text-white mb-2">Party Size</div>
              <div className="text-white/80 text-sm">{guests}</div>
            </div>
            
            {/* Book Now button */}
            <div className="flex items-center justify-center p-2">
              <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 h-auto font-medium text-lg">
                Order Now
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