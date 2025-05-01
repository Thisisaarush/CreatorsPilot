import { NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import prisma from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return new NextResponse("Unauthorized", { status: 401 })

    const user = await currentUser()
    const email =
      user?.emailAddresses?.[0]?.emailAddress ?? "unknown@placeholder.com"

    const body = await req.json()
    const { title, content, platform, scheduledAt } = body

    const post = await prisma.post.create({
      data: {
        title,
        content,
        platform,
        status: "null",
        scheduledAt: new Date(scheduledAt),
        user: {
          connectOrCreate: {
            where: { id: userId },
            create: {
              id: userId,
              email,
            },
          },
        },
      },
    })

    return NextResponse.json(post)
  } catch (err) {
    console.error("Error saving post:", err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
