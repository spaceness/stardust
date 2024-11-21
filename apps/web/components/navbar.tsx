'use client'

import { Sparkles, LogOut } from 'lucide-react'

import clsx from 'clsx'
import { Computer, Container, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'

import { Avatar, AvatarFallback } from './ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { v4 } from 'uuid'

export default function Navbar() {
  const pathname = usePathname()

  if (pathname.includes('/sessions/view') || pathname.includes('/auth')) return null

  return (
    <div className="pt-16">
      <div className="fixed top-0 z-50 flex h-16 w-screen items-center justify-between bg-card/40 backdrop-blur-sm px-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-8 w-8" />
          <h1 className="text-2xl font-semibold">Stardust</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" className={clsx('flex items-center gap-2', pathname === '/' ? 'bg-accent' : null)}>
              <Container className="h-5 w-5" />
              Containers
            </Button>
          </Link>
          <Link href="/sessions">
            <Button variant="ghost" className={clsx('flex items-center gap-2', pathname.includes('/sessions') ? 'bg-accent' : null)}>
              <Computer className="h-5 w-5" />
              Sessions
            </Button>
          </Link>
          <Link href="/admin">
            <Button variant="ghost" className={clsx('flex items-center gap-2', pathname.includes('/admin') ? 'bg-accent' : null)}>
              <Settings className="h-5 w-5" />
              Manage
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar>
                <AvatarFallback>a</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">admin@local.host</p>
                  <p className="text-[0.5rem] leading-none text-muted-foreground">{v4()}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/auth/logout">
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
