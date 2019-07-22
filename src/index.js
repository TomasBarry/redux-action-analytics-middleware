// @flow

import type { Dispatch, Action, Store } from 'redux'

/**
 * The type key of an action must be a string (or serializable):
 * https://redux.js.org/faq/actions
 *
 * To enforce good practice, a TrackableAction must be a string. It would be
 * Possible to allow for other types, including non-serializable action type
 * values through the use of Generics (https://flow.org/en/docs/types/generics/)
 * and this may be added in a future version
 */

type TrackableActionType = string

/**
 * The generic type S represents the Redux state in the application that makes
 * use of this project. The `trackCallback` function will be passed the state
 * of the Redux application present before and after the action occurs
 */
type AnalyticsMiddlewareParameters<State> = {|
  trackCallback: (Action, State, State) => void,
  trackableActions: Array<TrackableActionType>
|}

const AnalyticsMiddleware = <State>({
  trackableActions,
  trackCallback
}: AnalyticsMiddlewareParameters<State>): ((Store) => Action) => {
  return ({ getState }: Store): Action => {
    return (next: Dispatch): Dispatch => {
      return (action: Action): Action => {
        // Skip the middleware if the action is not one of the trackable actions
        if (!trackableActions.includes(action.type)) return next(action)

        // Get the state pre and post the dispatching of the action and pass
        // this through to the trackCallback
        const preActionState = getState()
        const result = next(action)
        const postActionState = getState()

        // Provide the callback with the exposed information
        trackCallback(action, preActionState, postActionState)

        return result
      }
    }
  }
}

export default AnalyticsMiddleware
