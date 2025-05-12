"use client"

import { useRouter, useSearchParams } from "next/navigation"

export default function Filters({
  platform,
  status,
}: {
  platform: string
  status: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()))

    if (value === "All") {
      params.delete(key)
    } else {
      params.set(key, value)
    }

    router.push(`/calendar?${params.toString()}`)
  }

  return (
    <div className="flex gap-4">
      {/* PLATFORM */}
      <select
        value={platform}
        onChange={(e) => updateFilters("platform", e.target.value)}
        className="border p-2 rounded-md text-sm"
      >
        <option>All</option>
        <option>Instagram</option>
        <option>LinkedIn</option>
        <option>Twitter</option>
        <option>YouTube</option>
      </select>

      {/* STATUS */}
      <select
        value={status}
        onChange={(e) => updateFilters("status", e.target.value)}
        className="border p-2 rounded-md text-sm"
      >
        <option>All</option>
        <option>Draft</option>
        <option>Scheduled</option>
        <option>Published</option>
      </select>
    </div>
  )
}
