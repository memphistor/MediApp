export type MainTab = 'index' | 'calendar' | 'progress' | 'history'

let lastTab: MainTab = 'index'

export function rememberTab(name: string) {
  if (name === 'index' || name === 'calendar' || name === 'progress' || name === 'history') {
    lastTab = name
  }
}

export function tabBeforeWizard(): MainTab {
  return lastTab
}
