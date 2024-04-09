import { MenuComponent, Session } from 'main/types'
import { menuFactoryFromCommandFactory } from '../utils'

export const commands: MenuComponent = (session: Session) => () =>
  [
    {
      accelerator: 'CommandOrControl+Z',
      click: () => session.api.state.undo(),
      enabled: session.state.prevHistory.length !== 0,
      label: 'Undo',
    },
    {
      accelerator: 'CommandOrControl+Shift+Z',
      click: () => session.api.state.redo(),
      enabled: session.state.nextHistory.length !== 0,
      label: 'Redo',
    },
    { type: 'separator' },
    { label: 'Cut', role: 'cut' },
    { label: 'Copy', role: 'copy' },
    { label: 'Paste', role: 'paste' },
  ]

export default menuFactoryFromCommandFactory(commands)
