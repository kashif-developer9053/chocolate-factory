"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Cake, Truck, Utensils, MessageCircle } from "lucide-react"
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
const faqs = [
  {
    question: "Where do you source your imported chocolates from?",
    answer:
      "We source our imported chocolates from renowned chocolatiers and manufacturers around the world, including Switzerland, Belgium, France, Dubai, UK, and Saudi Arabia. We prioritize quality and authenticity to bring you the finest chocolates.",
  },
  {
    question: "Are your imported chocolates available year-round, or do you have seasonal offerings?",
    answer:
      "While many of our imported chocolates are available year-round, we also offer seasonal selections for holidays and special occasions. Check our website or store for the latest offerings.",
  },
  {
    question: "Do you offer chocolates with specific cocoa percentages or flavor profiles?",
    answer:
      "Yes, we curate a variety of chocolates with different cocoa percentages and flavor profiles, including dark, milk, and white chocolates to suit every preference.",
  },
  {
    question: "Can I find limited edition or exclusive chocolates at your store?",
    answer:
      "Absolutely! We frequently feature limited edition and exclusive chocolates not available elsewhere for unique and rare chocolate experiences.",
  },
  {
    question: "How do you ensure the quality and freshness of your imported chocolates?",
    answer:
      "Our chocolates are stored and handled with care under strict standards, and our inventory is regularly rotated to ensure optimal freshness and flavor.",
  },
  {
    question: "Do you offer gift packaging or customized gift options for special occasions?",
    answer:
      "Yes, we offer gift packaging and customized options for birthdays, weddings, and corporate events. Let us help you craft the perfect gift.",
  },
  {
    question: "Can I request specific brands or types of chocolates for special orders?",
    answer:
      "Certainly! We welcome requests for specific brands or types. Contact us and we’ll do our best to accommodate your preferences.",
  },
  {
    question: "Do you provide information about the origin and ingredients of your imported chocolates?",
    answer:
      "Yes, we share detailed origin and ingredient information. Our staff is always available to help you make informed choices.",
  },
  {
    question: "Are your imported chocolates suitable for individuals with dietary restrictions or allergies?",
    answer:
      "Many of our chocolates contain common allergens, but we also offer suitable options. Let us know your dietary needs and we’ll assist accordingly.",
  },
];
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };
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
     
      <main className="flex-1">
        {/* Hero Section - Enhanced */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
              alt="Bakery interior"
              fill
              style={{ objectFit: 'cover' }}
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50 backdrop-blur-sm"></div>
          </div>
          
          <div className="container relative z-10">
            <div className="grid gap-10 md:grid-cols-2 items-center">
              <div className="text-center md:text-left text-white">
                <span className="inline-block px-4 py-1 rounded-full bg-[#C8815F]/20 text-[#C8815F] text-sm font-medium mb-6 animate-pulse">Get In Touch</span>
                <h1 className="text-4xl md:text-6xl font-light tracking-wide mb-6 leading-tight">
                  Contact <span className="text-[#C8815F]">Us</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-200 max-w-xl mx-auto md:mx-0">
                  Have questions, special orders, or just want to say hello? Reach out and let's create something sweet together!
                </p>
                <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
                  <Button asChild size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 px-8 py-3 rounded-full text-lg font-medium tracking-wider uppercase">
                    <Link href="/products">Explore Our Menu</Link>
                  </Button>
                  
                </div>
              </div>
              <div className="hidden md:block relative h-[500px]">
             
                
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 w-full h-8 bg-[#f8f5f2] clip-diagonal z-10"></div>
        </section>

        {/* Contact Content Section - Enhanced with Timeline */}
        <section className="py-20 bg-[#f8f5f2] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#C8815F]/5 -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#C8815F]/5 translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="container relative z-10">
            <div className="grid gap-8 md:grid-cols-3">
              {/* Contact Info Column - Timeline Style */}
              <div className="md:col-span-1">
                <div className="relative border-l-2 border-[#C8815F]/20 pl-8 ml-4 space-y-12">
                  <div className="flex items-center justify-center mb-10">
                    <span className="h-px bg-[#C8815F]/30 w-12"></span>
                    <h2 className="text-3xl md:text-4xl font-light mx-4 text-[#2a201c]">Let's Connect</h2>
                    <span className="h-px bg-[#C8815F]/30 w-12"></span>
                  </div>
                  
                  {[
                    {
                      icon: Mail,
                      title: "Email Us",
                      subtitle: "We'll respond within 24 hours",
                      content: <a href="mailto: thechocolatesfactory@icloud.com" className="mt-1 block text-[#C8815F] font-medium hover:underline"> thechocolatesfactory@icloud.com</a>,
                    },
                    {
                      icon: Phone,
                      title: "Call Us",
                      subtitle: "Mon-Sat from 8am to 10pm",
                      content: <a href="tel:+923165658165" className="mt-1 block text-[#C8815F] font-medium hover:underline">+92316 565 81 65</a>,
                    },
                    {
                      icon: MapPin,
                      title: "Visit Us",
                    
                      content: (
                        <address className="mt-1 not-italic text-gray-700">
                          Plaza no. 181<br/> Shop no.9 <br/>Lower Ground, Civic Center <br/> Bahria Town, D
Phase 4 <br/> Islamabad
                        </address>
                      ),
                    },
                  
                  ].map((item, index) => (
                    <div key={index} className="relative transform hover:-translate-y-1 transition-transform">
                      <div className="absolute -left-4 w-8 h-8 rounded-full bg-[#C8815F] flex items-center justify-center">
                        <span className="text-white font-bold">{index + 1}</span>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-[#C8815F]/10 p-3 text-[#C8815F] flex-shrink-0">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#2a201c]">{item.title}</h3>
                          <p className="mt-1 text-sm text-gray-600">{item.subtitle}</p>
                          {item.content}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <h3 className="font-semibold text-[#2a201c] mb-4 text-center">Follow Us</h3>
                    <div className="flex gap-4 justify-center">
                      {[
                        { icon: "facebook", path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" },
                        { icon: "instagram", path: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01" },
                        { icon: "twitter", path: "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" },
                      ].map((social, index) => (
                        <a
                          key={index}
                          href="#"
                          className="rounded-full bg-[#C8815F]/10 p-3 text-[#C8815F] hover:bg-[#C8815F] hover:text-white transition-colors transform hover:scale-110"
                          aria-label={`Follow us on ${social.icon}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {social.icon === "instagram" ? (
                              <>
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d={social.path}></path>
                              </>
                            ) : (
                              <path d={social.path}></path>
                            )}
                          </svg>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Column - Enhanced */}
              <div className="md:col-span-2">
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-14 h-14 rounded-full bg-[#C8815F]/10 flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-[#C8815F]" />
                    </div>
                    <div>
                      <h2 className="text-3xl md:text-4xl font-light text-[#2a201c]">Send Us a Message</h2>
                      <p className="text-gray-600">We're here to help with any inquiries or special requests!</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2 transform hover:-translate-y-1 transition-transform">
                        <Label htmlFor="name" className="text-[#2a201c] font-semibold">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="border-gray-200 focus:border-[#C8815F] focus:ring-[#C8815F]/20 shadow-sm"
                        />
                      </div>
                      <div className="space-y-2 transform hover:-translate-y-1 transition-transform">
                        <Label htmlFor="email" className="text-[#2a201c] font-semibold">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="border-gray-200 focus:border-[#C8815F] focus:ring-[#C8815F]/20 shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 transform hover:-translate-y-1 transition-transform">
                      <Label htmlFor="phone" className="text-[#2a201c] font-semibold">Phone Number (Optional)</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+92 123 456 7890"
                        value={formData.phone}
                        onChange={handleChange}
                        className="border-gray-200 focus:border-[#C8815F] focus:ring-[#C8815F]/20 shadow-sm"
                      />
                    </div>

                

                    <div className="space-y-2 transform hover:-translate-y-1 transition-transform">
                      <Label htmlFor="message" className="text-[#2a201c] font-semibold">Your Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="How can we help you?"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="border-gray-200 focus:border-[#C8815F] focus:ring-[#C8815F]/20 resize-none shadow-sm"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-[#C8815F] hover:bg-[#A66B4F] text-white border-none px-8 transform hover:scale-105 transition-transform" 
                      size="lg" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          Send Message
                          <Send className="ml-2 h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </form>
                </div>
                
                {/* Image Section - Enhanced */}
                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  <div className="relative h-[300px] rounded-xl overflow-hidden shadow-xl border-8 border-white transform rotate-3">
                    <Image 
                      src="https://images.unsplash.com/photo-1608198093002-ad4e005484ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80" 
                      alt="Our fresh bakery items" 
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent flex items-center justify-center">
                      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg text-center max-w-xs">
                        <h3 className="text-xl font-semibold text-[#2a201c]">Special Orders Welcome!</h3>
                        <p className="text-sm text-gray-700 mt-2">Custom cakes, pastries, and catering for all occasions.</p>
                      </div>
                    </div>
                  </div>
                  <div className="relative h-[300px] rounded-xl overflow-hidden shadow-xl border-4 border-white transform -rotate-3">
                    <Image
                      src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
                      alt="Pastries"
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section - Enhanced */}
        <section className="py-20 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#C8815F]/5 -translate-y-1/2 translate-x-1/2"></div>
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <span className="inline-block px-4 py-1 rounded-full bg-[#C8815F]/10 text-[#C8815F] text-sm font-medium mb-4 animate-pulse">Find Us</span>
              <h2 className="text-3xl md:text-4xl font-light text-[#2a201c]">
                Visit <span className="text-[#C8815F]">Chalet Cafe</span>
              </h2>
              <p className="mt-4 text-gray-600">
                Join us in the heart of Islamabad for a warm, delightful experience!
              </p>
            </div>
            
            <div className="relative rounded-xl overflow-hidden shadow-md border border-gray-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6649.262647492115!2d73.04488097256163!3d33.72599623077015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfbffcd5f3ba2d%3A0xe8bba1398a19a04c!2sF-7%20Markaz%20F-7%2C%20Islamabad%2C%20Islamabad%20Capital%20Territory%2C%20Pakistan!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Chalet Cafe Location"
              ></iframe>
              <div className="absolute bottom-6 left-6 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-md">
                <Button asChild size="lg" className="bg-[#C8815F] hover:bg-[#A66B4F] text-white border-none">
                  <Link href="/locations">Get Directions</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs - Enhanced with Icons and Animations */}
<div className="py-20 bg-[#f8f5f2] relative overflow-hidden">
  <div className="w-[60%] mx-auto space-y-4">
    {faqs.map((faq, index) => (
      <div key={index} className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <button
          onClick={() => toggle(index)}
          className="w-full px-6 py-4 text-left font-medium text-[#2a201c] flex justify-between items-center hover:bg-[#f2ece9] transition-all"
        >
          <span>{faq.question}</span>
          <span className="text-[#C8815F] text-xl">
            {activeIndex === index ? '-' : '+'}
          </span>
        </button>
        {activeIndex === index && (
          <div className="px-6 pb-4 text-gray-600">{faq.answer}</div>
        )}
      </div>
    ))}
  </div>
</div>



   


        {/* CTA Section - Enhanced with Gradient and Parallax */}
        <section className="bg-gradient-to-b from-[#C8815F] to-[#A66B4F] py-16 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 transform translate-x-1/3 -translate-y-1/3 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-black/5 transform -translate-x-1/3 translate-y-1/3 animate-pulse"></div>
          
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-light mb-4">
                Join Our <span className="text-white">Newsletter</span>
              </h2>
              <p className="text-lg opacity-90 mb-8">
                Stay updated with seasonal offerings, exclusive promotions, and upcoming events at Chalet Cafe.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input 
                  type="email" 
                  placeholder="Your email address" 
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white focus:ring-white/20 shadow-sm"
                />
                <Button size="lg" className="bg-white text-[#C8815F] hover:bg-white/90 whitespace-nowrap transform hover:scale-105 transition-transform">
                  Subscribe
                </Button>
              </div>
              
              <p className="text-sm mt-4 opacity-80">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}