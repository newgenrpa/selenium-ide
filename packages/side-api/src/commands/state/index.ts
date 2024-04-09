import type { Shape as Get } from './get'
import type { Shape as GetUserPrefs } from './getUserPrefs'
import type { Shape as OnMutate } from './onMutate'
import type { Shape as Redo } from './redo'
import type { Shape as Set } from './set'
import type { Shape as SetActiveCommand } from './setActiveCommand'
import type { Shape as SetActiveSuite } from './setActiveSuite'
import type { Shape as SetActiveTest } from './setActiveTest'
import type { Shape as SetAll } from './setAll'
import type { Shape as SetCopiedCommands } from './setCopiedCommands'
import type { Shape as ToggleBreakpoint } from './toggleBreakpoint'
import type { Shape as ToggleSuiteMode } from './toggleSuiteMode'
import type { Shape as ToggleUserPrefCamelCase } from './toggleUserPrefCamelCase'
import type { Shape as ToggleUserPrefDisableCodeExportCompat } from './toggleUserPrefDisableCodeExportCompat'
import type { Shape as ToggleUserPrefIgnoreCertificateErrors } from './toggleUserPrefIgnoreCertificateErrors'
import type { Shape as ToggleUserPrefInsert } from './toggleUserPrefInsert'
import type { Shape as ToggleUserPrefTheme } from './toggleUserPrefTheme'
import type { Shape as Undo } from './undo'
import type { Shape as UpdateStepSelection } from './updateStepSelection'
import type { Shape as UpdateTestSelection } from './updateTestSelection'

import * as get from './get'
import * as getUserPrefs from './getUserPrefs'
import * as onMutate from './onMutate'
import * as redo from './redo'
import * as set from './set'
import * as setActiveCommand from './setActiveCommand'
import * as setActiveSuite from './setActiveSuite'
import * as setActiveTest from './setActiveTest'
import * as setAll from './setAll'
import * as setCopiedCommands from './setCopiedCommands'
import * as toggleBreakpoint from './toggleBreakpoint'
import * as toggleSuiteMode from './toggleSuiteMode'
import * as toggleUserPrefCamelCase from './toggleUserPrefCamelCase'
import * as toggleUserPrefDisableCodeExportCompat from './toggleUserPrefDisableCodeExportCompat'
import * as toggleUserPrefIgnoreCertificateErrors from './toggleUserPrefIgnoreCertificateErrors'
import * as toggleUserPrefInsert from './toggleUserPrefInsert'
import * as toggleUserPrefTheme from './toggleUserPrefTheme'
import * as undo from './undo'
import * as updateStepSelection from './updateStepSelection'
import * as updateTestSelection from './updateTestSelection'

export const commands = {
  get,
  getUserPrefs,
  onMutate,
  redo,
  set,
  setActiveCommand,
  setActiveSuite,
  setActiveTest,
  setAll,
  setCopiedCommands,
  toggleBreakpoint,
  toggleSuiteMode,
  toggleUserPrefCamelCase,
  toggleUserPrefDisableCodeExportCompat,
  toggleUserPrefIgnoreCertificateErrors,
  toggleUserPrefInsert,
  toggleUserPrefTheme,
  undo,
  updateStepSelection,
  updateTestSelection,
}

/**
 * Provides a wide range of functions for adjusting the current project state.
 */
export type Shape = {
  get: Get
  getUserPrefs: GetUserPrefs
  onMutate: OnMutate
  redo: Redo
  set: Set
  setActiveCommand: SetActiveCommand
  setActiveSuite: SetActiveSuite
  setActiveTest: SetActiveTest
  setAll: SetAll
  setCopiedCommands: SetCopiedCommands
  toggleBreakpoint: ToggleBreakpoint
  toggleSuiteMode: ToggleSuiteMode
  toggleUserPrefCamelCase: ToggleUserPrefCamelCase
  toggleUserPrefDisableCodeExportCompat: ToggleUserPrefDisableCodeExportCompat
  toggleUserPrefIgnoreCertificateErrors: ToggleUserPrefIgnoreCertificateErrors
  toggleUserPrefInsert: ToggleUserPrefInsert
  toggleUserPrefTheme: ToggleUserPrefTheme
  undo: Undo
  updateStepSelection: UpdateStepSelection
  updateTestSelection: UpdateTestSelection
}
