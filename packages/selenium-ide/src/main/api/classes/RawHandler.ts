import { Mutator } from '@seleniumhq/side-api'
import { ipcMain } from 'electron'
import noop from 'lodash/fp/noop'
import { AsyncHandler, HandlerFactory } from './Handler'
import { Session, SessionControllerKeys } from '../../types'

export type ParametersExceptFirst<F> = F extends (
  arg0: any,
  ...rest: infer R
) => any
  ? R
  : never

export type EventApiHandler = (
  event: Electron.IpcMainEvent,
  ...args: any[]
) => any

export type ModifiedHandler<HANDLER extends EventApiHandler> = (
  ...args: ParametersExceptFirst<HANDLER>
) => ReturnType<HANDLER>

const defaultHandler = <HANDLER extends EventApiHandler>(
  path: string,
  session: Session
): AsyncHandler<HANDLER> => {
  const [namespace, method] = path.split('.')
  const controller = session[namespace as SessionControllerKeys]
  if (controller && method in controller) {
    // @ts-expect-error
    return controller[method].bind(controller) as AsyncHandler<HANDLER>
  }
  console.warn(`Missing method for path ${path}, using passthrough`)
  return noop as unknown as AsyncHandler<HANDLER>
}

const Handler =
  <HANDLER extends EventApiHandler>(
    factory: HandlerFactory<HANDLER> = defaultHandler
  ) =>
  (
    path: string,
    session: Session,
    mutator?: Mutator<ModifiedHandler<HANDLER>>
  ) => {
    const handler = factory(path, session)
    const doAPI = async (...params: Parameters<HANDLER>) => {
      const result = await handler(...params)
      const serializableParams = params.slice(
        1
      ) as ParametersExceptFirst<HANDLER>
      await session.state.mutate(mutator, serializableParams, result, path)
      return result
    }
    ipcMain.handle(path, async (...args) => {
      session.system.loggers.api('Received API Request', path, args.slice(1))
      const result = await doAPI(...(args as Parameters<HANDLER>))
      session.system.loggers.api('Resolved API Request', path, result)
      return result
    })
    return doAPI
  }

export default Handler
