import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Camera, CirclePause, CirclePlay, CirclePower, Clipboard, Computer, Download, Files, GripVertical, Maximize, Trash2, Unplug, Upload } from 'lucide-react'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'

import Link from 'next/link'

export default function VNC() {
  return (
    <div>
      <img src={'https://assets.ubuntu.com/v1/7f84bfa4-Jellyfish.png'} className="h-screen w-screen" />

      <Sheet>
        <SheetTrigger asChild>
          <div className="fixed left-0 top-1/2 flex h-16 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-r-md bg-card/80 backdrop-blur-sm hover:bg-card duration-200">
            <GripVertical className="text-foreground/80" />
          </div>
        </SheetTrigger>
        <SheetContent side="left" className="w-2/5 overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-2xl">Session Options</SheetTitle>
          </SheetHeader>

          <Accordion type="multiple">
            <AccordionItem value="actions">
              <AccordionTrigger>
                <div className="flex items-center gap-4">
                  <CirclePlay className="h-9 w-9 rounded-md bg-accent p-1.5" /> Actions
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <Button className="w-full">
                    <CirclePause className="mr-2 h-5 w-5" /> Pause Session
                  </Button>
                  <Button className="w-full">
                    <CirclePower className="mr-2 h-5 w-5" /> Restart Session
                  </Button>
                  <Button className="w-full">
                    <Camera className="mr-2 h-5 w-5" /> Save Screenshot
                  </Button>
                  <Button className="w-full">
                    <Maximize className="mr-2 h-5 w-5" /> Enter Fullscreen
                  </Button>
                  <Button className="w-full" variant="destructive">
                    <Trash2 className="mr-2 h-5 w-5" /> Destroy Session
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="clipboard">
              <AccordionTrigger>
                <div className="flex items-center gap-4">
                  <Clipboard className="h-9 w-9 rounded-md bg-accent p-1.5" /> Clipboard
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">Enter text below and click Send to push it to the container's clipboard. Getting the clipboard will replace the current contents of the text box.</p>
                  <Textarea className="h-32" />
                  <Button className="w-full">
                    <Upload className="mr-2 h-5 w-5" /> Send Clipboard
                  </Button>
                  <Button className="w-full">
                    <Download className="mr-2 h-5 w-5" /> Get Clipboard
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="files">
              <AccordionTrigger>
                <div className="flex items-center gap-4">
                  <Files className="h-9 w-9 rounded-md bg-accent p-1.5" /> Files
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4"></div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="vnc">
              <AccordionTrigger>
                <div className="flex items-center gap-4">
                  <Computer className="h-9 w-9 rounded-md bg-accent p-1.5" /> VNC Options
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4"></div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Link href="/">
            <Button className="w-full">
              <Unplug className="mr-2 h-5 w-5" /> Disconnect
            </Button>
          </Link>
        </SheetContent>
      </Sheet>
    </div>
  )
}
