import { useSettings } from '@/src/context/SettingsContext'
import { scaledFont } from '@/src/theme/fontScale'
import { typeBase, typeLine } from '@/src/theme/tokens'

type TypeRole = keyof typeof typeBase

const weightFor: Record<TypeRole, '300' | '400' | '500'> = {
  title: '300',
  section: '500',
  body: '400',
  secondary: '400',
  caption: '500',
  button: '500',
  metric: '300',
}

function roleStyle(role: TypeRole, size: number) {
  const line = Math.round(size * (typeLine[role] / typeBase[role]))
  const letterSpacing = role === 'title' || role === 'metric' ? -0.8 : role === 'section' ? -0.3 : 0
  return {
    fontSize: size,
    lineHeight: line,
    fontWeight: weightFor[role],
    letterSpacing,
  }
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
