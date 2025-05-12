import { eachDayOfInterval, endOfMonth, format, startOfMonth } from "date-fns"
import prisma from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import CalendarGridClient from "./CalendarGridClient"

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

  if (platform !== "All") where.platform = platform
  if (status !== "All") where.status = status

  const posts = await prisma.post.findMany({ where })

  const postMap: Record<string, typeof posts> = {}
  posts.forEach((post) => {
    const key = format(post.scheduledAt || new Date(), "yyyy-MM-dd")
    postMap[key] = postMap[key] ? [...postMap[key], post] : [post]
  })

  const today = new Date()
  const start = startOfMonth(today)
  const end = endOfMonth(today)
  const days = eachDayOfInterval({ start, end })

  return <CalendarGridClient days={days} postMap={postMap} />
}
