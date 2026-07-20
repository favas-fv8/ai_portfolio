'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/utils/cn'

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)
  const [clicking, setClicking] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
    if (isTouchDevice) return

    const onMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setVisible(true)
    }

    const onDown = () => setClicking(true)
    const onUp = () => setClicking(false)

    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    const onHoverStart = () => setHovering(true)
    const onHoverEnd = () => setHovering(false)

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup', onUp)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    const interactives = document.querySelectorAll('a, button, [data-cursor]')
    interactives.forEach(el => {
      el.addEventListener('mouseenter', onHoverStart)
      el.addEventListener('mouseleave', onHoverEnd)
    })

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', onHoverStart)
        el.removeEventListener('mouseleave', onHoverEnd)
      })
    }
  }, [isTouchDevice])

  if (isTouchDevice) return null

  return (
    <>
      <div
        className={cn(
          'fixed pointer-events-none z-[600] transition-opacity duration-300',
          !visible && 'opacity-0',
        )}
        style={{
          left: position.x - 4,
          top: position.y - 4,
        }}
      >
        <div
          className={cn(
            'w-2 h-2 bg-accent-500 rounded-full transition-transform duration-150',
            clicking && 'scale-75',
          )}
        />
      </div>
      <div
        className={cn(
          'fixed pointer-events-none z-[600] rounded-full border border-accent-500/30',
          'transition-all duration-300 ease-flux',
          !visible && 'opacity-0',
          clicking && 'scale-75 border-accent-500/50',
          hovering && 'scale-150 border-accent-500/60 bg-accent-500/10',
        )}
        style={{
          left: position.x - 20,
          top: position.y - 20,
          width: 40,
          height: 40,
        }}
      />
    </>
  )
}
