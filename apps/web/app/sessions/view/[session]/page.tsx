'use client'
import VncStatus from '@/components/vnc/status'
import VNC from '@/components/vnc/viewer'

import { useEffect, useState } from 'react'

export default function SessionVNC() {
  const [status, setStatus] = useState('Loading')
  const [connecting, setConnecting] = useState(true)
  useEffect(() => {
    setTimeout(() => {
      setStatus('Connecting to VNC')
    })
    setTimeout(() => {
      setConnecting(false)
    }, 2000)
  })
  return <div>{connecting ? <VncStatus status={status} /> : <VNC />}</div>
}
