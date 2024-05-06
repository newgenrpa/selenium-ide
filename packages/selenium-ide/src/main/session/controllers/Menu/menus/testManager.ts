import { MenuComponent } from 'main/types'
import { menuFactoryFromCommandFactory } from '../utils'

export const commands: MenuComponent<[string[]]> = (session) => (testIDs) => {
  const outputFormats = session.outputFormats.getFormats()
  const languageMap = session.system.languageMap
  return [
    {
      accelerator: 'CommandOrControl+Shift+Delete',
      click: async () => {
        await Promise.all(
          testIDs.map((testID) => session.api.tests.delete(testID))
        )
      },
      label: languageMap.testsTab.deleteTest,
    },
    { type: 'separator' },
    ...outputFormats.map((formatName) => ({
      label: languageMap.testsTab.exportTest + formatName,
      click: async () => {
        await Promise.all(
          testIDs.map((testID) =>
            session.outputFormats.exportTestToFormat(formatName, testID)
          )
        )
      },
    })),
  ]
}

export default menuFactoryFromCommandFactory(commands)
