import { cva } from 'class-variance-authority'

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
