import Link from 'next/link'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from './ui/button'
import NextImage from 'next/image'

type Props = {
  image: string
  name: string
  type: string
}

export default function ContainerCard({ image, name, type }: Props) {
  return (
    <>
      <Dialog>
        <DialogTrigger>
          <div className="relative w-64 aspect-[5/3] rounded-lg overflow-hidden shadow-lg bg-accent/40 backdrop-blur-lg group">
            <NextImage src={image} alt={name} fill className="object-cover group-hover:scale-105 duration-200" />
            <div className="absolute inset-0 bg-gradient-to-t from-accent/90 to-transparent" />
            <div className="absolute bottom-2 left-2 text-white flex flex-col">
              <h3 className="text-lg font-bold">{name}</h3>
              <p className="text-left text-sm text-muted-foreground">{type}</p>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Session</DialogTitle>
            <DialogDescription>Would you like to launch a new {name} session?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Link href="/sessions/view/hi">
              <Button>Launch</Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
