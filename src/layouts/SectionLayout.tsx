import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

interface SectionLayoutProps {
  id: string
  children: React.ReactNode
  className?: string
  containerClassName?: string
}

const SectionLayout = forwardRef<HTMLElement, SectionLayoutProps>(
  ({ id, children, className, containerClassName }, ref) => {
    return (
      <section
        id={id}
        ref={ref}
        className={cn('relative w-full overflow-hidden', className)}
      >
        <div className={cn('mx-auto max-w-7xl w-full section-padding', containerClassName)}>
          {children}
        </div>
      </section>
    )
  },
)

SectionLayout.displayName = 'SectionLayout'

export default SectionLayout
