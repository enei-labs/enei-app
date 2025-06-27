export interface MenuConfig {
  icon: string
  name: string
  path: string
  isNotify?: boolean
  component?: React.ComponentType<Record<string, unknown>>
}
