"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import MainNav from "@/components/main-nav"
import Footer from "@/components/footer"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [debugInfo, setDebugInfo] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setDebugInfo("") // Clear previous debug info

    try {
      console.log('🚀 Starting login request...')
      console.log('📧 Email:', formData.email)
      console.log('🔐 Password length:', formData.password.length)

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      console.log('📡 Response status:', response.status)
      console.log('📡 Response ok:', response.ok)
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()))

      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      console.log('📄 Content-Type:', contentType)

      let data
      try {
        const responseText = await response.text()
        console.log('📄 Raw response:', responseText)
        
        if (contentType && contentType.includes('application/json')) {
          data = JSON.parse(responseText)
          console.log('✅ Parsed JSON data:', data)
        } else {
          console.error('❌ Response is not JSON!')
          setDebugInfo(`Error: Server returned non-JSON response. Content-Type: ${contentType}`)
          throw new Error('Server returned non-JSON response')
        }
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError)
        setDebugInfo(`JSON Parse Error: ${parseError.message}`)
        throw new Error('Failed to parse server response')
      }

      // Handle different response scenarios
      if (response.ok && data.success) {
        console.log('✅ Login successful!')
        console.log('👤 User data:', data.data)
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(data.data))
        
        // Print role to console
        console.log('🎭 User role:', data.data.role)
        
        toast({
          title: "Login successful",
          description: "Welcome back to ShopEase!",
        })
        
        // Dispatch auth change event to update navigation
        window.dispatchEvent(new CustomEvent('authChanged'))
        
        // ✅ REDIRECT FUNCTIONALITY - STILL HERE AND WORKING!
        // Redirect based on role
        if (data.data.role === 'admin') {
          console.log('🔀 Redirecting to ADMIN dashboard...')
          setDebugInfo('✅ Login successful! Redirecting to admin dashboard...')
          router.push('/admin')
        } else if (data.data.role === 'user') {
          console.log('🔀 Redirecting to USER profile...')
          setDebugInfo('✅ Login successful! Redirecting to user profile...')
          router.push('/profile')
        } else {
          console.log('🔀 Fallback redirect to profile...')
          setDebugInfo('✅ Login successful! Using fallback redirect to profile...')
          router.push('/profile')
        }
      } else {
        // Handle API errors
        console.error('❌ Login failed!')
        console.error('📄 Error data:', data)
        
        const errorMessage = data?.message || data?.error || 'Invalid credentials'
        console.error('💬 Error message:', errorMessage)
        
        setDebugInfo(`Login failed: ${errorMessage} (Status: ${response.status})`)
        
        toast({
          title: "Login failed",
          description: errorMessage,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('💥 Catch block error:', error)
      console.error('💥 Error stack:', error.stack)
      
      setDebugInfo(`Network/Parse Error: ${error.message}`)
      
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      console.log('🏁 Login request completed')
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container flex items-center justify-center py-12 md:py-16 lg:py-20">
          <Card className="mx-auto w-full max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
              <CardDescription>Enter your email and password to access your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-10 w-10 text-muted-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => setFormData({ ...formData, rememberMe: !!checked })}
                  />
                  <Label htmlFor="remember" className="text-sm">
                    Remember me for 30 days
                  </Label>
                </div>

                {/* Debug Information Display */}
                {debugInfo && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-800 font-medium">Debug Info:</p>
                    <p className="text-xs text-red-600 mt-1">{debugInfo}</p>
                    <p className="text-xs text-red-500 mt-1">Check browser console for detailed logs</p>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}