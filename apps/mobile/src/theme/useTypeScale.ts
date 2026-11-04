import { useSettings } from '@/src/context/SettingsContext'
import { scaledFont } from '@/src/theme/fontScale'
import { typeBase, typeLine } from '@/src/theme/tokens'

type TypeRole = keyof typeof typeBase

function roleStyle(role: TypeRole, size: number) {
  const weight =
    role === 'title' || role === 'section' || role === 'button' || role === 'metric'
      ? ('600' as const)
      : ('400' as const)
  const line = Math.round(size * (typeLine[role] / typeBase[role]))
  return { fontSize: size, lineHeight: line, fontWeight: weight }
}

export function useTypeScale() {
  const { settings } = useSettings()
  const scale = settings.fontScale
  const size = (base: number) => Math.round(scaledFont(base, scale))

  return {
    title: roleStyle('title', size(typeBase.title)),
    section: roleStyle('section', size(typeBase.section)),
    body: roleStyle('body', size(typeBase.body)),
    secondary: roleStyle('secondary', size(typeBase.secondary)),
    caption: roleStyle('caption', size(typeBase.caption)),
    button: roleStyle('button', size(typeBase.button)),
    metric: roleStyle('metric', size(typeBase.metric)),
  }
}
