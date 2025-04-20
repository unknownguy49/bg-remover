"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, ImageIcon, Download, Save } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import { LoginDialog } from "@/components/login-dialog"
import { ImageHistory } from "@/components/image-history"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ImageCompare } from "@/components/image-compare"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function BackgroundRemover() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [resultImage, setResultImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [imageName, setImageName] = useState("")
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuth()

  // Reset image name when a new file is selected
  useEffect(() => {
    if (selectedFile) {
      setImageName(selectedFile.name.split(".")[0] || "Untitled")
    }
  }, [selectedFile])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setPreview(URL.createObjectURL(file))
      setResultImage(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsLoading(true)
    const formData = new FormData()
    formData.append("file", selectedFile)

    try {
      const response = await axios.post("http://localhost:8000/remove-bg/", formData, {
        responseType: "blob",
      })

      const imageURL = URL.createObjectURL(response.data)
      setResultImage(imageURL)
      toast({
        title: "Success!",
        description: "Background removed successfully",
      })
    } catch (err) {
      console.error("Upload failed", err)
      toast({
        title: "Error",
        description: "Failed to remove background. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = () => {
    if (!isAuthenticated) {
      setShowLoginDialog(true)
      return
    }

    if (!resultImage) return

    // Get existing history from localStorage
    const historyString = localStorage.getItem(`bgRemover_history_${user.id}`)
    const history = historyString ? JSON.parse(historyString) : []

    // Add new entry
    const newEntry = {
      id: Date.now(),
      name: imageName || "Untitled",
      originalImage: preview,
      resultImage: resultImage,
      date: new Date().toISOString(),
    }

    // Save to localStorage
    localStorage.setItem(`bgRemover_history_${user.id}`, JSON.stringify([newEntry, ...history]))

    toast({
      title: "Saved!",
      description: "Image saved to your history",
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto py-8 px-4">
        <Tabs defaultValue="remove" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="remove">Remove Background</TabsTrigger>
            <TabsTrigger value="history">My History</TabsTrigger>
          </TabsList>

          <TabsContent value="remove" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Upload Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted transition-colors">
                        <Upload size={20} />
                        <span>Choose File</span>
                      </div>
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    <Button onClick={handleUpload} disabled={!selectedFile || isLoading} className="flex gap-2">
                      {isLoading ? "Processing..." : "Remove Background"}
                      {!isLoading && <ImageIcon size={18} />}
                    </Button>
                  </div>

                  {preview && (
                    <div className="mt-4 border rounded-md p-4 w-full">
                      <h3 className="text-lg font-medium mb-2">Preview</h3>
                      <div className="flex justify-center">
                        <img
                          src={preview || "/placeholder.svg"}
                          alt="Preview"
                          className="max-w-full max-h-[300px] object-contain rounded-md"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {resultImage && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Result</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center gap-4">
                      <div className="border rounded-md p-4 w-full">
                        <div className="flex justify-center">
                          <img
                            src={resultImage || "/placeholder.svg"}
                            alt="No background"
                            className="max-w-full max-h-[300px] object-contain rounded-md bg-grid"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 w-full max-w-md">
                        <Button asChild variant="outline" className="flex gap-2">
                          <a href={resultImage} download={`${imageName || "no-background"}.png`}>
                            <Download size={18} />
                            Download
                          </a>
                        </Button>

                        <Button onClick={handleSave} className="flex gap-2">
                          <Save size={18} />
                          Save to History
                        </Button>

                        <div className="flex-1 min-w-[200px]">
                          <Label htmlFor="image-name">Image Name</Label>
                          <Input
                            id="image-name"
                            value={imageName}
                            onChange={(e) => setImageName(e.target.value)}
                            placeholder="Enter image name"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {preview && resultImage && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Compare</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ImageCompare beforeImage={preview} afterImage={resultImage} />
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="history">
            <ImageHistory />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />

      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </div>
  )
}
