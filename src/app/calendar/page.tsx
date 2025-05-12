import CalendarGrid from "@/components/calendar/CalendarGrid.server"
import Filters from "@/components/calendar/Filters"

type Params = Promise<{ slug: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function CalendarPage(props: {
  params: Params
  searchParams: SearchParams
}) {
  const searchParams = await props.searchParams

  const platform = searchParams.platform?.toString() || "All"
  const status = searchParams.status?.toString() || "All"

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Content Calendar</h1>
      <Filters platform={platform} status={status} />
      <CalendarGrid platform={platform} status={status} />
    </main>
  )
}
