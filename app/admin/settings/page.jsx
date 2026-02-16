"use client";

import { useState, useEffect, useRef } from "react";
import { Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState("/placeholder.svg"); // Default logo
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // For local preview
  const fileInputRef = useRef(null); // To reset file input

  // Fetch current logo on mount
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await axios.get("/api/admin/settings?key=logoUrl");
        if (response.data.success && response.data.data.logoUrl) {
          setLogoUrl(response.data.data.logoUrl);
        }
      } catch (error) {
        console.error("Error fetching logo:", error);
        toast({
          title: "Error",
          description: "Failed to load logo settings.",
          variant: "destructive",
        });
      }
    };
    fetchLogo();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
      console.log("File selected:", selectedFile.name, selectedFile.type);
    } else {
      setFile(null);
      setPreviewUrl(null);
      toast({
        title: "Invalid File",
        description: "Please select a valid image file (e.g., PNG, JPG).",
        variant: "destructive",
      });
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSaveSettings = async () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a logo image to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const base64Logo = await convertFileToBase64(file);
      const data = {
        key: "logoUrl",
        logo: base64Logo,
      };

      console.log("Sending logo data:", { key: "logoUrl", logo: base64Logo.substring(0, 50) + "..." });

      const response = await axios.put("/api/admin/settings", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer your-admin-token", // Replace with your auth token
        },
      });

      if (response.data.success) {
        setLogoUrl(response.data.data.logoUrl);
        setFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Reset file input
        }
        toast({
          title: "Settings saved",
          description: "Logo updated successfully.",
        });
        // Reload the page after successful submission
        window.location.reload();
      } else {
        throw new Error(response.data.message || "Failed to update logo");
      }
    } catch (error) {
      console.error("Error saving logo:", error);
      let errorMessage = error.response?.data?.message || error.message || "Failed to save logo";
      if (errorMessage.includes("No logo file provided")) {
        errorMessage = "Please select a valid logo image.";
      } else if (errorMessage.includes("Invalid Content-Type")) {
        errorMessage = "Invalid file upload request.";
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setLogoUrl("/placeholder.svg");
    toast({
      title: "Reset",
      description: "Logo settings reset to default.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Store Settings</h1>
        <p className="text-muted-foreground">Manage your store logo</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Store Logo</CardTitle>
          <CardDescription>Customize your store's logo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="logoUpload">Store Logo</Label>
            <div className="flex items-center gap-4">
              <img
                src={previewUrl || logoUrl || "/placeholder.svg"}
                alt="Store Logo"
                className="h-12 w-auto rounded-md border"
              />
              <Input
                id="logoUpload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full"
                ref={fileInputRef}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleReset} disabled={isLoading}>
            Reset
          </Button>
          <Button onClick={handleSaveSettings} disabled={isLoading || !file}>
            {isLoading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin">...</span>
                Saving
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}