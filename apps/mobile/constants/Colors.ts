import { themeColors, colors } from '@/src/theme/colors'

const tintColorLight = colors.brand
const tintColorDark = colors.brandMuted

export default {
  light: {
    text: themeColors('light').text,
    background: themeColors('light').surface,
    tint: tintColorLight,
    tabIconDefault: themeColors('light').textMuted,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: themeColors('dark').text,
    background: themeColors('dark').surface,
    tint: tintColorDark,
    tabIconDefault: themeColors('dark').textMuted,
    tabIconSelected: tintColorDark,
  },
}
