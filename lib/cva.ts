// Custom class variance authority replacement
export type VariantProps<T extends (...args: any) => any> = {
  [K in keyof NonNullable<Parameters<T>[0]>]?: NonNullable<Parameters<T>[0]>[K]
}

export function cva(
  base: string,
  config?: {
    variants?: Record<string, Record<string, string>>
    defaultVariants?: Record<string, string>
  },
) {
  return (props: Record<string, any> = {}) => {
    let classes = base

    if (config?.variants) {
      Object.entries(config.variants).forEach(([key, variants]) => {
        const value = props[key] ?? config.defaultVariants?.[key]
        if (value && variants[value]) {
          classes += ` ${variants[value]}`
        }
      })
    }

    if (props.className) {
      classes += ` ${props.className}`
    }

    return classes
  }
}
