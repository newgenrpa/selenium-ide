import { getCommandIndex } from '@seleniumhq/side-api/dist/helpers/getActiveData'
import { state as defaultState, Mutator } from '@seleniumhq/side-api'
import {
  CamelCaseNamesPref,
  CoreSessionData,
  defaultUserPrefs,
  IgnoreCertificateErrorsPref,
  InsertCommandPref,
  StateShape,
  ThemePref,
  UserPrefs,
} from '@seleniumhq/side-api'
import clone from 'lodash/fp/clone'
import merge from 'lodash/fp/merge'
import BaseController from '../Base'
import { loadingID } from '@seleniumhq/side-api/dist/constants/loadingID'
import getCore from 'main/api/helpers/getCore'

const queue = (op: () => void) => setTimeout(op, 0)

export default class StateController extends BaseController {
  static pathFromID = (id: string) => id.replace(/-/g, '_')

  prevHistory: CoreSessionData[] = []
  nextHistory: CoreSessionData[] = []

  state: StateShape = clone(defaultState)

  appendHistory(path: string) {
    if (path.includes('setAll')) return
    if (this.session.projects.project.id !== loadingID) {
      this.prevHistory.push(this.get())
      this.nextHistory = []
    }
  }

  async undo() {
    const prev = this.prevHistory.pop()
    if (prev) {
      this.nextHistory.push(this.get())
      this.session.api.state.setAll(prev)
    }
  }

  async redo() {
    const next = this.nextHistory.pop()
    if (next) {
      this.prevHistory.push(this.get())
      this.session.api.state.setAll(next)
    }
  }

  async mutate<T extends (...args: any[]) => any>(
    mutator: undefined | Mutator<T>,
    params: Parameters<T>,
    result: Awaited<ReturnType<T>>,
    path: string
  ) {
    if (!mutator) return
    this.appendHistory(path)
    const { project, state } = mutator(getCore(this.session), {
      params,
      result,
    })
    this.session.projects.project = project
    this.session.state.state = state
    this.session.api.state.onMutate.dispatchEvent(path, { params, result })
  }

  get(): CoreSessionData {
    return {
      project: this.session.projects.project,
      state: this.state,
    }
  }

  setAll(data: CoreSessionData) {
    this.session.projects.project = data.project
    this.state = data.state
  }

  set(key: string, _data: any) {
    if (key.includes('editor.overrideWindowSize')) {
      queue(async () => {
        await this.session.resizablePanels.recalculatePlaybackWindows()
      })
    }
  }

  getStatePath() {
    const projectID = this.session.projects.project.id
    const projectIDPath = StateController.pathFromID(projectID)
    return `projectStates.${projectIDPath}`
  }

  async onProjectLoaded() {
    // If this file has been saved, fetch state
    if (this.session.projects.filepath) {
      console.log('Initializing state')
      const storageState: StateShape = this.session.store.get(
        this.getStatePath()
      )
      const newState: StateShape = merge(defaultState, storageState)
      newState.commands = this.state.commands
      newState.editor.selectedCommandIndexes = [0]
      if (!newState.activeTestID || newState.activeTestID === loadingID) {
        newState.activeTestID =
          this.session.projects.project.tests?.[0]?.id ?? loadingID
      }
      this.state = newState
    }
  }

  async onProjectUnloaded() {
    if (this.session.projects.filepath) {
      // If this file has been loaded or saved, save state
      this.session.store.set(this.getStatePath(), {
        ...this.state,
        playback: defaultState.playback,
        recorder: defaultState.recorder,
        status: 'idle',
      } as StateShape)
    }
    this.state = clone(defaultState)
  }

  async setActiveCommand(commandID: string): Promise<boolean> {
    const session = await this.session.state.get()
    const commandIndex = commandID ? getCommandIndex(session, commandID) : 0
    this.session.playback.currentStepIndex = commandIndex
    return true
  }

  async toggleUserPrefCamelCase(camelCaseNamesPref: CamelCaseNamesPref) {
    const userPrefs = await this.session.store.get(
      'userPrefs',
      defaultUserPrefs
    )
    this.session.store.set('userPrefs', { ...userPrefs, camelCaseNamesPref })
  }

  async toggleUserPrefTheme(themePref: ThemePref) {
    const userPrefs = await this.session.store.get(
      'userPrefs',
      defaultUserPrefs
    )
    this.session.store.set('userPrefs', { ...userPrefs, themePref })
  }

  async toggleUserPrefInsert(insertCommandPref: InsertCommandPref) {
    const userPrefs = await this.session.store.get(
      'userPrefs',
      defaultUserPrefs
    )
    this.session.store.set('userPrefs', { ...userPrefs, insertCommandPref })
  }

  async toggleUserPrefIgnoreCertificateErrors(
    ignoreCertificateErrorsPref: IgnoreCertificateErrorsPref
  ) {
    const userPrefs = await this.session.store.get(
      'userPrefs',
      defaultUserPrefs
    )
    this.session.store.set('userPrefs', {
      ...userPrefs,
      ignoreCertificateErrorsPref,
    })
  }

  async getUserPrefs(): Promise<UserPrefs> {
    return this.session.store.get('userPrefs', defaultUserPrefs)
  }
}
