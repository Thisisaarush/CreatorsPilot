import { eachDayOfInterval, endOfMonth, format, startOfMonth } from "date-fns"
import prisma from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import PostModal from "@/components/PostModal"
import ViewPostModal from "@/components/ViewPostModal"

export default async function CalendarGrid({
  platform,
  status,
}: {
  platform: string
  status: string
}) {
  const { userId } = await auth()
  if (!userId) return null

  const where: { [key: string]: string } = { userId }

  console.log("where", where, status, platform)

  if (platform !== "All") where.platform = platform
  if (status !== "All") where.status = status

  const posts = await prisma.post.findMany({ where })

  // Group posts by date (YYYY-MM-DD)
  const postMap: Record<string, typeof posts> = {}
  posts.forEach((post) => {
    const key = format(post.scheduledAt || new Date(), "yyyy-MM-dd")
    postMap[key] = postMap[key] ? [...postMap[key], post] : [post]
  })

  const today = new Date()
  const start = startOfMonth(today)
  const end = endOfMonth(today)
  const days = eachDayOfInterval({ start, end })

  return (
    <div className="grid grid-cols-7 gap-2 mt-4">
      {days.map((day) => {
        const dateKey = format(day, "yyyy-MM-dd")
        const dailyPosts = postMap[dateKey] || []

        return (
          <div
            key={dateKey}
            className="border rounded-md p-2 h-28 text-sm flex flex-col justify-between"
          >
            <div className="text-xs font-bold">{format(day, "d")}</div>
            <div className="space-y-1 mt-2 overflow-auto">
              {dailyPosts.map((post) => (
                <ViewPostModal
                  key={post.id}
                  post={{
                    ...post,
                    scheduledAt: post.scheduledAt
                      ? post.scheduledAt.toISOString()
                      : "",
                  }}
                />
              ))}
            </div>
            <PostModal triggerDate={format(day, "yyyy-MM-dd")} />
          </div>
        )
      })}
    </div>
  )
}
