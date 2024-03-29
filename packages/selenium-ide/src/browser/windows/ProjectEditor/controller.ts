import { WindowConfig } from 'browser/types'
import Electron from 'electron'
import { platform } from 'os'

export const window: WindowConfig['window'] = () => {
  const display = Electron.screen.getPrimaryDisplay()
  return {
    x: 50,
    y: 50,

    width: display.bounds.width ,
    height: display.bounds.height ,
titleBarStyle: platform() === 'darwin' ? 'hidden' : 'default',
  }
}
