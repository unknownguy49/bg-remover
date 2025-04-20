"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { Download, Trash2, ExternalLink } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { formatDistanceToNow } from "date-fns"

export function ImageHistory() {
  const { user, isAuthenticated } = useAuth()
  const [history, setHistory] = useState([])
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => {
    if (isAuthenticated) {
      const historyString = localStorage.getItem(`bgRemover_history_${user.id}`)
      if (historyString) {
        setHistory(JSON.parse(historyString))
      }
    }
  }, [isAuthenticated, user])

  const handleDelete = (id) => {
    const updatedHistory = history.filter((item) => item.id !== id)
    localStorage.setItem(`bgRemover_history_${user.id}`, JSON.stringify(updatedHistory))
    setHistory(updatedHistory)
    setDeleteId(null)
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">Please log in to view your history</h3>
        <p className="text-muted-foreground">Your processed images will be saved here after you log in.</p>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No images in your history yet</h3>
        <p className="text-muted-foreground">Process and save images to see them here.</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Your Image History</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="grid grid-cols-2 h-40">
              <div className="border-r p-2 flex items-center justify-center bg-muted/30">
                <img
                  src={item.originalImage || "/placeholder.svg"}
                  alt={`Original: ${item.name}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="p-2 flex items-center justify-center bg-grid">
                <img
                  src={item.resultImage || "/placeholder.svg"}
                  alt={`Result: ${item.name}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>

            <CardContent className="p-4">
              <h3 className="font-medium truncate">{item.name}</h3>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
              </p>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex justify-between">
              <Button asChild variant="outline" size="sm">
                <a href={item.resultImage} download={`${item.name}.png`}>
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </a>
              </Button>

              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => window.open(item.resultImage, "_blank")}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete this image from your history.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete(deleteId)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
