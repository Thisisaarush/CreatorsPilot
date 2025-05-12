import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/db"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { userId } = await auth()
  if (!userId) return new NextResponse("Unauthorized", { status: 401 })

  const body = await request.json()
  const { title, content, platform, status } = body

  try {
    const updated = await prisma.post.update({
      where: {
        id: id,
        userId: userId,
      },
      data: {
        title,
        content,
        platform,
        status,
      },
    })

    return NextResponse.json(updated)
  } catch (err) {
    console.error("Update error:", err)
    return new NextResponse("Server Error", { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { userId } = await auth()
  if (!userId) return new NextResponse("Unauthorized", { status: 401 })

  try {
    await prisma.post.delete({
      where: {
        id: id,
        userId,
      },
    })

    return new NextResponse("Deleted", { status: 200 })
  } catch (err) {
    console.error("Delete error:", err)
    return new NextResponse("Server Error", { status: 500 })
  }
}
