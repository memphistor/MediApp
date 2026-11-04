import { ChoiceGroup, type ChoiceOption } from '@/src/components/ui/ChoiceGroup'

export type FormSelectOption = ChoiceOption

type FormSelectProps = {
  label: string
  value: string
  options: FormSelectOption[]
  onChange: (value: string) => void
  error?: string
}

export function FormSelect({
  label,
  value,
  options,
  onChange,
  error,
}: FormSelectProps) {
  return (
    <ChoiceGroup
      label={label}
      value={value}
      options={options}
      onChange={onChange}
      error={error}
    />
  )
}
