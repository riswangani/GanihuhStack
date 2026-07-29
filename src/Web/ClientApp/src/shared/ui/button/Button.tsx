import { type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/lib/utils'
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react'
import { buttonVariants } from './buttonVariants'

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
