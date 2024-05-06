import type { Shape as Crash } from './crash'
import type { Shape as GetLanguage } from './getLanguage'
import type { Shape as GetLanguageMap } from './getLanguageMap'
import type { Shape as GetLogPath } from './getLogPath'
import type { Shape as OnLog } from './onLog'
import type { Shape as Quit } from './quit'
import type { Shape as SetLanguage } from './setLanguage'

import * as crash from './crash'
import * as getLanguage from './getLanguage'
import * as getLanguageMap from './getLanguageMap'
import * as getLogPath from './getLogPath'
import * as onLog from './onLog'
import * as quit from './quit'
import * as setLanguage from './setLanguage'

export const commands = {
  crash,
  getLanguage,
  getLanguageMap,
  getLogPath,
  onLog,
  quit,
  setLanguage,
}

/**
 * Allows for the IDE process to be exited gracefully or non-gracefully.
 */
export type Shape = {
  crash: Crash
  getLanguage: GetLanguage
  getLanguageMap: GetLanguageMap
  getLogPath: GetLogPath
  onLog: OnLog
  quit: Quit
  setLanguage: SetLanguage
}
