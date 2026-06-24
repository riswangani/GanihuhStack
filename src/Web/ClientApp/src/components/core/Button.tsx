import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-sans text-sm font-medium tracking-[0.01em] leading-tight cursor-pointer transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-default no-underline',
  {
    variants: {
      variant: {
        solid:   'bg-ink text-paper border border-ink rounded-[2px] px-5 py-[11px]',
        outline: 'bg-transparent text-ink border border-ink rounded-[2px] px-5 py-[11px]',
        ghost:   'bg-transparent text-ink border-b border-ink pb-[2px]',
      },
    },
    defaultVariants: { variant: 'solid' },
  }
)

type ButtonProps = VariantProps<typeof buttonVariants> & { children: ReactNode; className?: string }

type Props =
  | (ButtonProps & { href: string } & AnchorHTMLAttributes<HTMLAnchorElement>)
  | (ButtonProps & { href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>)

export default function Button({ variant, className, children, ...rest }: Props) {
  const cls = cn(buttonVariants({ variant }), className)
  if ('href' in rest && rest.href !== undefined) {
    const { href, ...anchorRest } = rest as { href: string } & AnchorHTMLAttributes<HTMLAnchorElement>
    return <a href={href} className={cls} {...anchorRest}>{children}</a>
  }
  return <button className={cls} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>{children}</button>
}
