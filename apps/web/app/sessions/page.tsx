import SessionCard from "@/components/sessioncard";

export const metadata = {
  title: 'Active Sessions'
}

export default function SessionsList() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold">Active Sessions</h1>
      <div className="flex flex-wrap gap-4 py-6">
        <SessionCard />
      </div>
    </div>
  )
}
