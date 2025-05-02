import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/db"

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth()
  if (!userId) return new NextResponse("Unauthorized", { status: 401 })

  const body = await req.json()
  const { title, content, platform } = body

  try {
    const updated = await prisma.post.update({
      where: {
        id: params.id,
        userId: userId,
      },
      data: {
        title,
        content,
        platform,
      },
    })

    return NextResponse.json(updated)
  } catch (err) {
    console.error("Update error:", err)
    return new NextResponse("Server Error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth()
  if (!userId) return new NextResponse("Unauthorized", { status: 401 })

  try {
    await prisma.post.delete({
      where: {
        id: params.id,
        userId,
      },
    })

    return new NextResponse("Deleted", { status: 200 })
  } catch (err) {
    console.error("Delete error:", err)
    return new NextResponse("Server Error", { status: 500 })
  }
}
