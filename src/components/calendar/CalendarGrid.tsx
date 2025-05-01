"use client"

import { eachDayOfInterval, endOfMonth, format, startOfMonth } from "date-fns"
import PostModal from "@/components/PostModal"

export default function CalendarGrid() {
  const today = new Date()
  const start = startOfMonth(today)
  const end = endOfMonth(today)
  const days = eachDayOfInterval({ start, end })

  return (
    <div className="grid grid-cols-7 gap-2 mt-4">
      {days.map((day) => (
        <div
          key={day.toString()}
          className="border rounded-md p-2 h-24 text-sm hover:bg-muted cursor-pointer"
        >
          {format(day, "d")}
          <PostModal triggerDate={format(day, "yyyy-MM-dd")} />
        </div>
      ))}
    </div>
  )
}
