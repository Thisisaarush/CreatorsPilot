"use client"

import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  MouseSensor,
  DragEndEvent,
  useDroppable,
} from "@dnd-kit/core"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import PostModal from "@/components/PostModal"
import DraggablePost from "./DraggablePost"

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

export default function CalendarGridClient({
  days,
  postMap,
}: {
  days: Date[]
  postMap: Record<string, any[]>
}) {
  const router = useRouter()
  const sensors = useSensors(useSensor(MouseSensor))

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!active?.id || !over?.id || active.id === over.id) return

    const postId = active.id as string
    const newDate = over.id as string

    await fetch(`/api/posts/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scheduledAt: newDate }),
    })

    router.refresh()
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
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
    </DndContext>
  )
}
