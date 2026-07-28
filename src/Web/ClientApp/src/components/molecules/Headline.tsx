import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import type { ElementType, MouseEvent, ReactNode } from 'react'

interface Props {
  children: ReactNode
  size?: 'md' | 'lg' | 'xl'
  as?: ElementType
  href?: string
  to?: string
  onClick?: (e: MouseEvent) => void
  className?: string
}

const sizeClass = {
  md: 'text-headline-md',
  lg: 'text-headline-lg',
  xl: 'text-headline-xl',
}

const linkCls = 'no-underline text-inherit border-b border-transparent transition-[border-color] duration-[120ms] hover:border-ink'

export default function Headline({ children, size = 'lg', as: Tag = 'h3', href, to, onClick, className }: Props) {
  const inner = (
    <span className={cn('font-serif font-medium leading-[1.18] text-ink tracking-[-0.005em]', sizeClass[size])}>
      {children}
    </span>
  )
  return (
    <Tag className={cn('m-0', className)}>
      {to ? (
        <Link to={to} className={linkCls}>{inner}</Link>
      ) : href ? (
        <a href={href} onClick={onClick} className={linkCls}>{inner}</a>
      ) : inner}
    </Tag>
  )
}
