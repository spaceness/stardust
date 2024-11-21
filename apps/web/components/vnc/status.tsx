import { Loader2 } from 'lucide-react'

export default function VncStatus({ status }: { status: string }) {
  return (
    <div className="h-40 w-96 bg-accent/50 rounded-lg border border-border/50 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur-md flex items-center justify-center text-muted-foreground gap-3">
      <Loader2 className="animate-spin" /> 
      <h1 className="text-2xl font-bold">{status}</h1>
    </div>
  )
}
