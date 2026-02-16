"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, ArrowLeft, ChevronRight, Shield, User, Lock, Globe, Bell, Scale, Link2, Baby, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import MainNav from "@/components/main-nav"
import Footer from "@/components/footer"

export default function PrivacyPolicyPage() {
  const sections = [
    { id: "introduction", title: "Introduction", icon: Shield },
    { id: "collection", title: "What We Collect", icon: User },
    { id: "use", title: "How We Use It", icon: Lock },
    { id: "storage", title: "Data Storage", icon: Globe },
    { id: "marketing", title: "Marketing", icon: Bell },
    { id: "rights", title: "Your Rights", icon: Scale },
    { id: "third-party", title: "Third-Party Links", icon: Link2 },
    { id: "children", title: "Children’s Privacy", icon: Baby },
    { id: "updates", title: "Policy Updates", icon: RefreshCw },
  ] as const

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background via-[#8B4513]/10 to-[#D2691E]/10 font-poppins">
      {/* Google Fonts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

      <main className="flex-1">
        {/* Hero Section with Wave */}
        <div className="relative bg-gradient-to-r from-[#8B4513]/20 to-[#D2691E]/20 py-20 overflow-hidden">
          <div className="container text-center">
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-[#8B4513] tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Privacy Policy
            </motion.h1>
            <motion.p
              className="mt-3 text-sm text-muted-foreground max-w-lg mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              Last Updated: June 15, 2025
            </motion.p>
          </div>
          {/* Wave SVG */}
          <svg
            className="absolute bottom-0 w-full h-16 text-background"
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
          >
            <path
              fill="currentColor"
              d="M0,50 C360,100 1080,0 1440,50 L1440,100 L0,100 Z"
            />
          </svg>
        </div>

        <div className="container py-12 md:py-16 lg:py-20 flex flex-col lg:flex-row gap-10">
          {/* Sidebar Table of Contents */}
          <motion.aside
            className="lg:w-1/4 sticky top-20 h-fit bg-gradient-to-b from-[#8B4513]/5 to-[#D2691E]/5 rounded-xl shadow-sm p-6 backdrop-blur-sm"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-lg font-semibold text-[#8B4513] mb-5 tracking-tight">Contents</h2>
            <ul className="space-y-3">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className="text-sm text-[#8B4513] hover:bg-[#D2691E]/10 hover:pl-3 rounded-lg py-2 w-full text-left flex items-center transition-all duration-300"
                  >
                    <section.icon className="h-4 w-4 mr-2" />
                    {index + 1}. {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </motion.aside>

          {/* Main Content */}
          <Card className="lg:w-3/4 shadow-lg rounded-2xl bg-card/90 backdrop-blur-sm border-none">
            <CardHeader className="bg-[#8B4513]/5 rounded-t-2xl">
              <CardTitle className="text-2xl font-bold text-[#8B4513] tracking-tight">
                Your Privacy, Our Priority
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Discover how we safeguard your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-12 p-8">
              <motion.section
                id="introduction"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-5 w-5 text-[#D2691E]" />
                  <h2 className="text-xl font-semibold text-[#8B4513] tracking-tight">1. Introduction</h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  At The Chocolates Factory, your trust is our foundation. This Privacy Policy explains how we collect, use, and protect your personal information, ensuring transparency and security in every interaction with our website or services.
                </p>
              </motion.section>

              <motion.section
                id="collection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <User className="h-5 w-5 text-[#D2691E]" />
                  <h2 className="text-xl font-semibold text-[#8B4513] tracking-tight">2. What We Collect</h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  To deliver a seamless shopping experience, we collect:
                </p>
                <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground space-y-2">
                  <li>Your full name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Delivery and billing addresses</li>
                  <li>Payment details (securely handled by third-party processors)</li>
                </ul>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  We also use cookies to personalize your experience and analyze site performance.
                </p>
              </motion.section>

              <motion.section
                id="use"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="h-5 w-5 text-[#D2691E]" />
                  <h2 className="text-xl font-semibold text-[#8B4513] tracking-tight">3. How We Use It</h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your information helps us:
                </p>
                <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground space-y-2">
                  <li>Fulfill your orders efficiently</li>
                  <li>Update you on order status</li>
                  <li>Provide top-notch customer support</li>
                  <li>Enhance our website’s functionality</li>
                  <li>Share exclusive offers, if you opt in</li>
                </ul>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  All data is secured with SSL encryption for your peace of mind.
                </p>
              </motion.section>

              <motion.section
                id="storage"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="h-5 w-5 text-[#D2691E]" />
                  <h2 className="text-xl font-semibold text-[#8B4513] tracking-tight">4. Data Storage</h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We store your data only as long as needed for our services or legal requirements. Cookies may remain for up to 24 months, manageable via your browser. After retention, data is securely deleted or anonymized.
                </p>
              </motion.section>

              <motion.section
                id="marketing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Bell className="h-5 w-5 text-[#D2691E]" />
                  <h2 className="text-xl font-semibold text-[#8B4513] tracking-tight">5. Marketing</h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Subscribe to our newsletters for updates on new chocolates, sales, and promotions. Unsubscribe anytime via email links or by contacting:
                </p>
                <p className="mt-3 flex items-center text-sm text-[#D2691E] hover:underline transition-colors duration-300">
                  <Mail className="mr-2 h-4 w-4" />
                  <a href="mailto:thechocolatefactory@icloud.com">
                    thechocolatefactory@icloud.com
                  </a>
                </p>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  Your data stays with us—never shared with third-party marketers.
                </p>
              </motion.section>

              <motion.section
                id="rights"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Scale className="h-5 w-5 text-[#D2691E]" />
                  <h2 className="text-xl font-semibold text-[#8B4513] tracking-tight">6. Your Rights</h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You can:
                </p>
                <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground space-y-2">
                  <li>Access your personal data</li>
                  <li>Correct or delete inaccurate data</li>
                  <li>Opt out of marketing communications</li>
                </ul>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  Reach us at <a href="mailto:thechocolatefactory@icloud.com" className="text-[#D2691E] hover:underline">thechocolatefactory@icloud.com</a> to exercise your rights.
                </p>
              </motion.section>

              <motion.section
                id="third-party"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Link2 className="h-5 w-5 text-[#D2691E]" />
                  <h2 className="text-xl font-semibold text-[#8B4513] tracking-tight">7. Third-Party Links</h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our site may link to external platforms (e.g., courier tracking, social media). We’re not responsible for their privacy policies.
                </p>
              </motion.section>

              <motion.section
                id="children"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Baby className="h-5 w-5 text-[#D2691E]" />
                  <h2 className="text-xl font-semibold text-[#8B4513] tracking-tight">8. Children’s Privacy</h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our services are not for children under 13. We do not knowingly collect their data.
                </p>
              </motion.section>

              <motion.section
                id="updates"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <RefreshCw className="h-5 w-5 text-[#D2691E]" />
                  <h2 className="text-xl font-semibold text-[#8B4513] tracking-tight">9. Policy Updates</h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We may update this policy to reflect new practices or laws. Changes will be posted here or emailed to you.
                </p>
              </motion.section>
            </CardContent>
            <CardContent className="bg-[#8B4513]/5 rounded-b-2xl p-6">
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <Button
                  asChild
                  variant="outline"
                  className="hover:bg-[#D2691E]/10 hover:scale-105 transition-transform duration-300"
                >
                  <Link href="/" className="flex items-center">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="default"
                  className="bg-[#D2691E] text-white hover:bg-[#8B4513] hover:scale-105 transition-transform duration-300"
                >
                  <a href="mailto:thechocolatefactory@icloud.com" className="flex items-center">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Support
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}