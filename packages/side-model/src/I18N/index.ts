import { ArgTypes } from '../ArgTypes'
import Commands from '../Commands'

type I18NModelDataShape = {
  ArgTypes: ArgTypes
  Commands: typeof Commands
}

const supportedLanguages = ['en', 'zh'] as const

type SupportedLanguages = typeof supportedLanguages[number]

const loadI18NData = async (
  languageCode: SupportedLanguages
): Promise<I18NModelDataShape> => {
  const languageSubstring = languageCode.slice(0, 2)
  if (!supportedLanguages.includes(languageSubstring as SupportedLanguages)) {
    console.error(`Unsupported language code: ${languageCode}`)
    console.warn('Falling back to english for now')
    return await loadI18NData('en')
  }

  const [ArgTypes, Commands] = await Promise.all([
    import(`./${languageCode}/ArgTypes`),
    import(`./${languageCode}/Commands`),
  ])
  return {
    ArgTypes: ArgTypes.default,
    Commands: Commands.default,
  }
}

export default loadI18NData
