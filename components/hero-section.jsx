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
          backgroundImage: 'url("images/bg.jpg")',
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
         Your sweet treat awaits!
        </h1>
        <p className="text-xl md:text-2xl italic text-center mb-8 font-light">
          Indulge in the Finest of the Chocolates and Snaks
        </p>
        <p className="text-xl md:text-2xl text-center mb-2 font-light">
          At The Chocolates Factory right at your doorstep.
        </p>
       
        <p className="text-xl md:text-2xl text-center mb-2 font-light">
         we bring you a curated selection of the world's best chocolates and snacks,
        </p>
        
        <p className="text-xl md:text-2xl text-center mb-12 font-light">
         Whether you're craving rich, velvety chocolate or a savory treat, we've got something to satisfy every craving.
        </p>
     
        {/* Shop Now Button - matching the image design */}
        <Button 
          className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 px-8 py-3 rounded-full text-lg font-medium tracking-wider uppercase"
        >
          SHOP NOW
        </Button>
        
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