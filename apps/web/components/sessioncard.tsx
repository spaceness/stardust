import { Computer, PlayCircle, ScreenShare, StopCircle, Trash2 } from 'lucide-react'
import { Button } from './ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'

export default function SessionCard() {
  return (
    <div className="flex w-64 flex-col rounded-lg border">
      <TooltipProvider delayDuration={0}>
        <div className="flex h-11 w-full items-center justify-between rounded-t-lg bg-card px-4 font-semibold">
          <span className="flex items-center gap-4">
            Debian <span className="font-mono text-xs font-thin text-muted-foreground">a72df6</span>
          </span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="h-6 w-6 hover:bg-destructive" size="icon" variant="ghost">
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="font-normal">Delete Session</TooltipContent>
          </Tooltip>
        </div>
        <div>
          <img alt="Session preview" src={'https://wiki.friendlyelec.com/wiki/images/c/c8/Debian11-xfce.png'} className="aspect-video w-full" />
          {/* <div className="flex aspect-video w-full items-center justify-center bg-background">
            <Computer className="h-16 w-16 text-muted-foreground/60" />
          </div> */}
        </div>
        <div className="flex h-14 w-full items-center justify-evenly rounded-b-lg bg-card px-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost">
                <ScreenShare />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Connect</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" disabled>
                <PlayCircle />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Start Session</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost">
                <StopCircle />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Stop Session</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  )
}
