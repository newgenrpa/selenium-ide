import { MenuComponent } from 'main/types'
import { menuFactoryFromCommandFactory } from '../utils'

export const commands: MenuComponent<[string[]]> = (session) => (suiteIDs) => {
  const outputFormats = session.outputFormats.getFormats()
  const languageMap = session.system.languageMap
  return [
    {
      accelerator: 'CommandOrControl+Shift+Delete',
      click: async () => {
        await Promise.all(
          suiteIDs.map((suiteID) => session.api.suites.delete(suiteID))
        )
      },
      label: languageMap.suitesTab.deleteSuite,
    },
    { type: 'separator' },
    ...outputFormats.map((formatName) => ({
      label: languageMap.suitesTab.exportSuite + formatName,
      click: async () => {
        await Promise.all(
          suiteIDs.map((suiteID) =>
            session.outputFormats.exportSuiteToFormat(formatName, suiteID)
          )
        )
      },
    })),
  ]
}

export default menuFactoryFromCommandFactory(commands)
