"use client"

import { useState } from "react"
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  MouseSensor,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import PostModal from "@/components/PostModal"
import DraggablePost from "./DraggablePost"
import { motion } from "framer-motion"

export function DayCell({
  dateKey,
  children,
}: {
  dateKey: string
  children: React.ReactNode
}) {
  const { setNodeRef } = useDroppable({ id: dateKey })

  return (
    <div
      ref={setNodeRef}
      id={dateKey}
      className="border rounded-md p-2 h-28 text-sm flex flex-col justify-between"
    >
      <div className="text-xs font-bold">{dateKey.slice(-2)}</div>
      {children}
    </div>
  )
}

function getPlatformColor(platform: string) {
  switch (platform) {
    case "Instagram":
      return "bg-pink-500 text-white"
    case "LinkedIn":
      return "bg-blue-600 text-white"
    case "Twitter":
      return "bg-sky-500 text-white"
    case "YouTube":
      return "bg-red-600 text-white"
    default:
      return "bg-gray-400 text-white"
  }
}

export default function CalendarGridClient({
  days,
  postMap,
}: {
  days: Date[]
  postMap: Record<string, any[]>
}) {
  const router = useRouter()
  const sensors = useSensors(useSensor(MouseSensor))
  const [activePost, setActivePost] = useState<any>(null)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={(event) => {
        const allPosts = Object.values(postMap).flat()
        const post = allPosts.find((p) => p.id === event.active.id)
        setActivePost(post)
      }}
      onDragEnd={async (event) => {
        const { active, over } = event
        setActivePost(null)
        if (!active?.id || !over?.id || active.id === over.id) return

        const postId = active.id as string
        const newDate = over.id as string

        await fetch(`/api/posts/${postId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scheduledAt: newDate }),
        })

        router.refresh()
      }}
    >
      <div className="grid grid-cols-7 gap-2 mt-4">
        {days.map((day) => {
          const dateKey = format(day, "yyyy-MM-dd")
          const dailyPosts = postMap[dateKey] || []

          return (
            <DayCell key={dateKey} dateKey={dateKey}>
              <div className="space-y-1 mt-2 overflow-auto">
                {dailyPosts.map((post) => (
                  <DraggablePost key={post.id} post={post} />
                ))}
              </div>
              <PostModal triggerDate={dateKey} />
            </DayCell>
          )
        })}
      </div>
      <DragOverlay>
        {activePost ? (
          <motion.div
            className={`p-2 rounded shadow-md border text-sm font-medium w-full max-w-[200px] ${getPlatformColor(
              activePost.platform
            )}`}
            initial={{ scale: 0.95, opacity: 0.8 }}
            animate={{ scale: 1.05, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {activePost.title}
          </motion.div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
