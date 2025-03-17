interface Option<T = any> {
  label: string
  value: T
  disabled?: boolean
}

export default Option
