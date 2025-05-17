"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Calendar } from "@/components/ui/calendar"
import { addDays } from "date-fns"

type Post = {
  id: string
  title: string
  platform: string
  content: string | null
  scheduledAt: string
  status: string
}

export default function ViewPostModal({ post }: { post: Post }) {
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(post.title)
  const [platform, setPlatform] = useState(post.platform)
  const [content, setContent] = useState(post.content || "")
  const [status, setStatus] = useState(post.status)

  const [showDuplicate, setShowDuplicate] = useState(false)
  const [duplicateDate, setDuplicateDate] = useState<Date | undefined>(
    addDays(new Date(), 1)
  )

  const handleSave = async () => {
    if (
      title === post.title &&
      platform === post.platform &&
      content === (post.content || "") &&
      status === post.status
    ) {
      return
    }

    const res = await fetch(`/api/posts/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, platform, content, status }),
    })

    if (res.ok) {
      router.refresh()
      setOpen(false)
    }
  }

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this post?")
    if (!confirmed) return

    const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" })

    if (res.ok) {
      router.refresh()
      setOpen(false)
    }
  }

  const handleDuplicate = async () => {
    if (!duplicateDate) return

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        platform,
        content,
        status,
        scheduledAt: duplicateDate,
      }),
    })

    if (res.ok) {
      router.refresh()
      setShowDuplicate(false)
      setOpen(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <span
            className={`text-xs px-2 py-1 inline-block text-white cursor-pointer ${
              platform === "Instagram"
                ? "bg-pink-500"
                : platform === "LinkedIn"
                ? "bg-blue-600"
                : platform === "Twitter"
                ? "bg-sky-500"
                : platform === "YouTube"
                ? "bg-red-600"
                : "bg-gray-400"
            }`}
          >
            {platform}
          </span>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
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
              Save Changes
            </Button>
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleDelete}
            >
              Delete Post
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setShowDuplicate(true)}
            >
              Duplicate Post
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ✅ Duplicate Modal (separate) */}
      <Dialog open={showDuplicate} onOpenChange={setShowDuplicate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Duplicate Post</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-2">
            Select a new date to schedule the duplicate post:
          </p>
          <Calendar
            mode="single"
            selected={duplicateDate}
            onSelect={setDuplicateDate}
            fromDate={new Date()}
          />
          <Button onClick={handleDuplicate} className="mt-4 w-full">
            Confirm Duplicate
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
