import { useMagnetic } from '@/hooks/useMagnetic'
import { cn } from '@/utils/cn'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  href?: string
  target?: string
  rel?: string
  as?: 'button' | 'a'
  [key: string]: unknown
}

export default function MagneticButton({
  children,
  className,
  onClick,
  href,
  target,
  rel,
  as = 'button',
  ...props
}: MagneticButtonProps) {
  const ref = useMagnetic<HTMLButtonElement | HTMLAnchorElement>(0.25)

  if (as === 'a') {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        className={cn('inline-block', className)}
        {...props}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      onClick={onClick}
      className={cn('inline-block', className)}
      {...props}
    >
      {children}
    </button>
  )
}
