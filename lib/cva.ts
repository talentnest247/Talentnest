// Custom class variance authority replacement
type CVAFunction = (props?: Record<string, string | boolean | undefined>) => string

export type VariantProps<T extends CVAFunction> = 
  T extends (props: infer P) => string ? P : never

export function cva(
  base: string,
  config?: {
    variants?: Record<string, Record<string, string>>
    defaultVariants?: Record<string, string>
  },
) {
  return (props: Record<string, string | boolean | undefined> = {}) => {
    let classes = base

    if (config?.variants) {
      Object.entries(config.variants).forEach(([key, variants]) => {
        const value = props[key] ?? config.defaultVariants?.[key]
        if (value && typeof value === 'string' && variants[value]) {
          classes += ` ${variants[value]}`
        }
      })
    }

    return classes
  }
}
