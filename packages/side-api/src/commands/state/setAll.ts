import { CoreSessionData, Mutator } from '../../types/base'

/**
 * Set the whole session state
 */
export type Shape = (state: CoreSessionData) => Promise<void>

export const mutator: Mutator<Shape> = (_session, { params: [newSession] }) =>
  newSession
