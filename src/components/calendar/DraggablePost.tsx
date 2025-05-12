"use client"

import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import ViewPostModal from "@/components/ViewPostModal"
import { motion } from "framer-motion"

export default function DraggablePost({ post }: { post: any }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: post.id,
    })

  const style = {
    transform: transform ? CSS.Translate.toString(transform) : undefined,
    zIndex: isDragging ? 50 : 1,
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      layout
      initial={{ scale: 1 }}
      animate={{ scale: isDragging ? 1.05 : 1, opacity: isDragging ? 0.8 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <ViewPostModal post={post} />
    </motion.div>
  )
}
