"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function OurStory() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.3,
        delayChildren: 0.2
      } 
    }
  }
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#1a1310] to-[#2a201c] text-white overflow-hidden py-20">
      {/* Decorative elements with brownish colors */}
      <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-[#C8815F]/20 blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-64 h-64 rounded-full bg-[#8B5A2B]/20 blur-3xl"></div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          {/* Headline - reduced size */}
          <motion.h1 
            className="text-4xl md:text-6xl font-light tracking-tight mb-6 uppercase text-center"
            variants={itemVariants}
          >
            Our <span className="text-[#C8815F]">Delicious</span> Story
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p 
            className="text-lg md:text-xl text-center max-w-3xl mx-auto mb-12 italic text-gray-300"
            variants={itemVariants}
          >
            From humble beginnings to culinary excellence
          </motion.p>
          
          {/* Timeline */}
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16" variants={containerVariants}>
            {/* First section */}
            <motion.div className="relative" variants={itemVariants}>
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#C8815F] to-[#A66B4F] rounded-full hidden md:block"></div>
              <div className="absolute -left-6 top-0 w-5 h-5 rounded-full bg-[#C8815F] hidden md:block"></div>
              <h2 className="text-2xl font-bold mb-3 text-[#C8815F]">The Beginning</h2>
              <p className="text-gray-300 mb-4">
                Chalet Cafe was born in 2013 from a simple yet profound passion: creating moments of joy through extraordinary baked goods. Our founder, Maria Ahmed, transformed her grandmother's recipes into what would become Islamabad's most beloved bakery.
              </p>
              <div className="relative h-60 w-full rounded-lg overflow-hidden mb-6">
             <Image 
                src="https://images.unsplash.com/photo-1608198093002-ad4e005484ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                alt="Bakery beginnings" 
                fill 
                className="object-cover"
                />
              </div>
            </motion.div>
            
            {/* Second section */}
            <motion.div className="relative" variants={itemVariants}>
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#A66B4F] to-[#8B5A2B] rounded-full hidden md:block"></div>
              <div className="absolute -left-6 top-0 w-5 h-5 rounded-full bg-[#A66B4F] hidden md:block"></div>
              <h2 className="text-2xl font-bold mb-3 text-[#A66B4F]">Mastering Our Craft</h2>
              <p className="text-gray-300 mb-4">
                Over the years, we've perfected our craft through relentless dedication to quality. Our team traveled across Europe to study under master bakers, bringing home techniques that blend international excellence with Pakistani flavors.
              </p>
              <div className="relative h-60 w-full rounded-lg overflow-hidden mb-6">
                <Image 
                  src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                  alt="Bakers at work" 
                  fill 
                  className="object-cover"
                />
              </div>
            </motion.div>
            
            {/* Third section */}
            <motion.div className="relative" variants={itemVariants}>
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#8B5A2B] to-[#6F4E37] rounded-full hidden md:block"></div>
              <div className="absolute -left-6 top-0 w-5 h-5 rounded-full bg-[#8B5A2B] hidden md:block"></div>
              <h2 className="text-2xl font-bold mb-3 text-[#8B5A2B]">Growing Together</h2>
              <p className="text-gray-300 mb-4">
                What started as a small corner shop has blossomed into Islamabad's premier bakery destination. We've grown alongside our community, creating special moments for birthdays, weddings, and everyday celebrations.
              </p>
              <div className="relative h-60 w-full rounded-lg overflow-hidden mb-6">
                <Image 
                  src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                  alt="Bakery growth" 
                  fill 
                  className="object-cover"
                />
              </div>
            </motion.div>
            
            {/* Fourth section */}
            <motion.div className="relative" variants={itemVariants}>
              <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-[#6F4E37] to-[#C8815F] rounded-full hidden md:block"></div>
              <div className="absolute -left-6 top-0 w-5 h-5 rounded-full bg-[#6F4E37] hidden md:block"></div>
              <h2 className="text-2xl font-bold mb-3 text-[#6F4E37]">Today's Chalet Cafe</h2>
              <p className="text-gray-300 mb-4">
                Today, Chalet Cafe stands as a testament to our unwavering commitment to excellence. With three locations across the city, we continue to innovate while honoring the traditions that made us who we are.
              </p>
              <div className="relative h-60 w-full rounded-lg overflow-hidden mb-6">
                <Image 
                  src="https://images.unsplash.com/photo-1568254183919-78a4f43a2877?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                  alt="Modern bakery interior" 
                  fill 
                  className="object-cover"
                />
              </div>
            </motion.div>
          </motion.div>
          
          {/* Values section */}
          <motion.div variants={containerVariants} className="mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-light uppercase text-center mb-12"
              variants={itemVariants}
            >
              Our <span className="text-[#C8815F]">Values</span>
            </motion.h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div 
                className="bg-[#C8815F]/10 backdrop-blur-lg p-6 rounded-xl border border-[#C8815F]/20 hover:border-[#C8815F]/50 transition-all"
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(200, 129, 95, 0.3)" }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#C8815F] to-[#A66B4F] rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl">🌟</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Quality</h3>
                <p className="text-gray-300 text-sm">
                  We never compromise on ingredients or processes. Every item is crafted with the finest materials and utmost care.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-[#A66B4F]/10 backdrop-blur-lg p-6 rounded-xl border border-[#A66B4F]/20 hover:border-[#A66B4F]/50 transition-all"
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(166, 107, 79, 0.3)" }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#A66B4F] to-[#8B5A2B] rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl">💖</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Passion</h3>
                <p className="text-gray-300 text-sm">
                  Baking isn't just our profession—it's our calling. We pour our hearts into every creation that leaves our kitchen.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-[#8B5A2B]/10 backdrop-blur-lg p-6 rounded-xl border border-[#8B5A2B]/20 hover:border-[#8B5A2B]/50 transition-all"
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(139, 90, 43, 0.3)" }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#8B5A2B] to-[#6F4E37] rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl">🌱</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Community</h3>
                <p className="text-gray-300 text-sm">
                  We're proud to be part of Islamabad's fabric, supporting local farmers and engaging with our neighborhood.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-[#6F4E37]/10 backdrop-blur-lg p-6 rounded-xl border border-[#6F4E37]/20 hover:border-[#6F4E37]/50 transition-all"
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(111, 78, 55, 0.3)" }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#6F4E37] to-[#5D4037] rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl">🚀</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Innovation</h3>
                <p className="text-gray-300 text-sm">
                  While respecting tradition, we constantly experiment with new flavors and techniques to surprise and delight.
                </p>
              </motion.div>
            </div>
          </motion.div>
          
          {/* CTA section */}
          <motion.div 
            className="text-center"
            variants={itemVariants}
          >
            <h2 className="text-2xl md:text-3xl font-light mb-4">Join Our Sweet Journey</h2>
            <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
              Come experience the magic of Chalet Cafe. Whether it's your first visit or your hundredth, we can't wait to serve you.
            </p>
            <Button className="bg-[#C8815F] hover:bg-[#A66B4F] text-white px-6 py-5 h-auto rounded-md text-base font-medium">
              Visit Us Today
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}