import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/db"
import { format, isThisWeek } from "date-fns"

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) return null

  const posts = await prisma.post.findMany({
    where: { userId },
    orderBy: { scheduledAt: "asc" },
  })

  const drafts = posts.filter((p) => p.status === "Draft")
  const scheduled = posts.filter((p) => p.status === "Scheduled")
  const published = posts.filter((p) => p.status === "Published")

  const thisWeek = posts.filter(
    (p) => p.scheduledAt && isThisWeek(new Date(p.scheduledAt))
  )

  const platformStats: Record<string, number> = {}
  posts.forEach((post) => {
    const platform = post.platform
    platformStats[platform] = (platformStats[platform] || 0) + 1
  })

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📊 Creator Dashboard</h1>

      <section className="grid grid-cols-3 gap-4">
        <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">📝 Drafts</p>
          <p className="text-xl font-bold">{drafts.length}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">📅 Scheduled</p>
          <p className="text-xl font-bold">{scheduled.length}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">✅ Published</p>
          <p className="text-xl font-bold">{published.length}</p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mt-6 mb-2">🧵 Platform Stats</h2>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(platformStats).map(([platform, count]) => (
            <div
              key={platform}
              className="bg-white border p-3 rounded-md shadow-sm"
            >
              <p className="text-sm text-muted-foreground">{platform}</p>
              <p className="text-lg font-bold">{count}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mt-6 mb-2">
          📅 This Week&apos;s Posts
        </h2>
        <ul className="space-y-2">
          {thisWeek.map((post) => (
            <li
              key={post.id}
              className="p-3 border rounded-md shadow-sm bg-white"
            >
              <p className="text-sm font-semibold">{post.title}</p>
              <p className="text-xs text-muted-foreground">
                {post.platform} • {format(post.scheduledAt!, "MMM d, yyyy")}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
