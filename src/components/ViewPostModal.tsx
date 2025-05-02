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

type Post = {
  id: string
  title: string
  platform: string
  content: string | null
  scheduledAt: string
}

export default function ViewPostModal({ post }: { post: Post }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(post.title)
  const [platform, setPlatform] = useState(post.platform)
  const [content, setContent] = useState(post.content || "")

  const router = useRouter()

  const handleSave = async () => {
    if (
      title === post.title &&
      platform === post.platform &&
      content === (post.content || "")
    ) {
      alert("No changes made.")
      return
    }

    const res = await fetch(`/api/posts/${post.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        platform,
        content,
      }),
    })

    if (res.ok) {
      alert("Post updated!")
      router.refresh()
      setOpen(false)
    } else {
      alert("Failed to update post.")
    }
  }

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this post?")
    if (!confirmed) return

    const res = await fetch(`/api/posts/${post.id}`, {
      method: "DELETE",
    })

    if (res.ok) {
      router.refresh()
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span
          className={`text-xs px-2 py-1 rounded-md inline-block text-white cursor-pointer ${
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
          <Button onClick={handleSave} className="w-full mt-2">
            Save Changes
          </Button>
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleDelete}
          >
            Delete Post
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
