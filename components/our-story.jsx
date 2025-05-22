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
    <section className="min-h-screen  text-white overflow-hidden py-20">
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
            className="text-4xl md:text-6xl text-black font-light tracking-tight mb-6 uppercase text-center"
            variants={itemVariants}
          >
            Our <span className="text-[#C8815F]">Delicious</span> Story
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p 
            className="text-lg md:text-xl text-center max-w-3xl mx-auto mb-12 italic text-gray-900"
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
              <h2 className="text-2xl font-bold mb-3 text-[#C8815F]">Starting from Home</h2>
              <p className="text-gray-600 mb-4">
The Chocolates Factory began as a home-based business in Rawalpindi.
 We sold imported chocolates and snacks through Instagram and WhatsApp.
 Every order was packed with care by our family and delivered locally.
              </p>
              <div className="relative h-60 w-full rounded-lg overflow-hidden mb-6">
             <Image 
                src="/images/opening.png" 
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
              <h2 className="text-2xl font-bold mb-3 text-[#A66B4F]">Growing Online</h2>
              <p className="text-gray-600 mb-4">
As demand grew, we expanded to Facebook and started running ads.
 More customers discovered us, and our daily orders increased.
 We offered bank transfers and cash-on-delivery for convenience.
              </p>
              <div className="relative h-60 w-full rounded-lg overflow-hidden mb-6">
                <Image 
                  src="/images/growing.png" 
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
              <h2 className="text-2xl font-bold mb-3 text-[#8B5A2B]">Storage & Team Expansion</h2>
              <p className="text-gray-600 mb-4">
 To manage inventory better, we rented a small storage room.
 This made packing and delivery faster and more organized.
 We also hired a helper to assist with deliveries.
              </p>
              <div className="relative h-60 w-full rounded-lg overflow-hidden mb-6">
                <Image 
                  src="/images/storage.png" 
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
              <h2 className="text-2xl font-bold mb-3 text-[#6F4E37]">Opening Our Store</h2>
              <p className="text-gray-600 mb-4">
With your support, we opened our first physical shop in a local market.
 Now, we proudly serve customers both online and in-store.
 The Chocolates Factory continues to grow with love and dedication.
              </p>
              <div className="relative h-60 w-full rounded-lg overflow-hidden mb-6">
                <Image 
                  src="/images/starting.png" 
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
                className="bg-secondary backdrop-blur-lg p-6 rounded-xl border border-[#C8815F]/20 hover:border-[#C8815F]/50 transition-all"
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(200, 129, 95, 0.3)" }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#C8815F] to-[#A66B4F] rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl">🌟</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-black">Quality</h3>
                <p className="text-black text-sm">
                  We never compromise on ingredients or processes. Every item is crafted with the finest materials and utmost care.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-secondary p-6 rounded-xl border border-[#A66B4F]/20 hover:border-[#A66B4F]/50 transition-all"
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(166, 107, 79, 0.3)" }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#A66B4F] to-[#8B5A2B] rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl">💖</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-black">Passion</h3>
                <p className="text-black text-sm">
                  Baking isn't just our profession—it's our calling. We pour our hearts into every creation that leaves our kitchen.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-secondary backdrop-blur-lg p-6 rounded-xl border border-[#8B5A2B]/20 hover:border-[#8B5A2B]/50 transition-all"
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(139, 90, 43, 0.3)" }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#8B5A2B] to-[#6F4E37] rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl">🌱</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-black">Community</h3>
                <p className="text-black text-sm">
                  We're proud to be part of Islamabad's fabric, supporting local farmers and engaging with our neighborhood.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-secondary backdrop-blur-lg p-6 rounded-xl border border-[#6F4E37]/20 hover:border-[#6F4E37]/50 transition-all"
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(111, 78, 55, 0.3)" }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#6F4E37] to-[#5D4037] rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl">🚀</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-black">Innovation</h3>
                <p className="text-black text-sm">
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
            <h2 className="text-2xl text-gray-600 md:text-3xl font-light mb-4">Join Our Sweet Journey</h2>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Come experience the magic of Chalet Cafe. Whether it's your first visit or your hundredth, we can't wait to serve you.
            </p>
           
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}