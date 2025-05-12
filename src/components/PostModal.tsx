"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function PostModal({ triggerDate }: { triggerDate: string }) {
  const [title, setTitle] = useState("")
  const [platform, setPlatform] = useState("Instagram")
  const [content, setContent] = useState("")
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState("Scheduled")

  const router = useRouter()

  const handleSave = async () => {
    if (!title) {
      alert("Please enter a title.")
      return
    }

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        platform,
        scheduledAt: triggerDate,
        status,
      }),
    })

    if (res.ok) {
      setTitle("")
      setPlatform("Instagram")
      setContent("")
      router.refresh()
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          + Add Post
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Post</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label>Platform</Label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full border rounded-md p-2 text-sm"
            >
              <option>Instagram</option>
              <option>LinkedIn</option>
              <option>Twitter</option>
              <option>YouTube</option>
            </select>
          </div>
          <div>
            <Label>Content</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div>
            <Label>Status</Label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded-md p-2 text-sm"
            >
              <option>Draft</option>
              <option>Scheduled</option>
              <option>Published</option>
            </select>
          </div>
          <Button onClick={handleSave} className="w-full">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
