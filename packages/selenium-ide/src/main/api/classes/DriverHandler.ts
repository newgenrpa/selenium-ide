import { ipcMain } from 'electron'
import {
  ApiHandler,
  DefaultRouteShape,
  EmptyApiHandler,
  Mutator,
} from '@seleniumhq/side-api'
import noop from 'lodash/fp/noop'
import { Session, SessionControllerKeys } from '../../types'

export type AsyncHandler<HANDLER extends ApiHandler> = (
  ...args: Parameters<HANDLER>
) => Promise<ReturnType<HANDLER>>

export type HandlerFactory<HANDLER extends ApiHandler> = (
  path: string,
  session: Session
) => AsyncHandler<HANDLER>

const defaultHandler = <HANDLER extends ApiHandler>(
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

const passThroughHandler = <HANDLER extends EmptyApiHandler>(
  _path: string,
  _session: Session
): AsyncHandler<HANDLER> => {
  const handler = async (..._args: Parameters<HANDLER>) => {}
  return handler as unknown as AsyncHandler<HANDLER>
}
export const passthrough = passThroughHandler

const Handler =
  <HANDLER extends ApiHandler = DefaultRouteShape>(
    factory: HandlerFactory<HANDLER> = defaultHandler
  ) =>
  (path: string, session: Session, mutator?: Mutator<HANDLER>) => {
    const handler = factory(path, session)
    const doAPI = async (...params: Parameters<HANDLER>) => {
      const result = await handler(...params)
      await session.state.mutate(mutator, params, result, path)
      return result
    }
    ipcMain.handle(path, async (_event, ...args) => {
      session.system.loggers.api('Received API Request', path, args)
      const result = await doAPI(...(args as Parameters<HANDLER>))
      session.system.loggers.api('Resolved API Request', path, result)
      return result
    })
    return doAPI
  }

export default Handler
