
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Checkbox } from "../../components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { toast } from "../../hooks/use-toast"

export default function AdminLoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // In your login form
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    console.log('Submitting with email:', formData.email);
    
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email.trim(), // Trim to remove any accidental spaces
        password: formData.password,
        rememberMe: formData.rememberMe,
      }),
      credentials: "include",
    });
    
    // Debug response
    console.log('Response status:', response.status);
    
    // Try to parse response as text first
    const textResponse = await response.text();
    
    try {
      // Try to parse the text as JSON
      const data = JSON.parse(textResponse);
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Login failed");
      }
      
      if (data.data.role !== "admin") {
        throw new Error("Access denied: Admin privileges required");
      }
      
      toast({
        title: "Admin login successful",
        description: `Welcome back, ${data.data.name}!`,
      });
      
      router.push("/admin");
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      console.error('Raw response:', textResponse);
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error("Login error:", error);
    toast({
      title: "Error",
      description: error.message || "An error occurred during login",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};

  console.log("Rendering AdminLoginPage") // Debug log

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="mx-auto w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Admin Sign In</CardTitle>
          <CardDescription>Enter your admin credentials to access the dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  className="pl-10 border-gray-300"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="/admin/reset-password" className="text-xs text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 border-gray-300"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-10 w-10 text-gray-500"
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
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, rememberMe: !!checked }))}
              />
              <Label htmlFor="remember" className="text-sm">
                Remember me for 30 days
              </Label>
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in as Admin"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <div className="text-center text-sm w-full">
            Not an admin?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Go to user login
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
