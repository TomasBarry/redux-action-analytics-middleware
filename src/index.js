// @flow

import type { Dispatch, Action } from 'redux'

/**
 * The type key of an action must be a string (or serializable):
 * https://redux.js.org/faq/actions
 *
 * To enforce good practice, a TrackableAction must be a string. It would be
 * Possible to allow for other types, including non-serializable action type
 * values through the use of Generics (https://flow.org/en/docs/types/generics/)
 * and this may be added in a future version.
 */

type TrackableActionType = string

type AnalyticsMiddlewareParameters = {|
  trackCallback: (Action) => void,
  trackableActions: Array<TrackableActionType>
|}

const AnalyticsMiddleware = ({
  trackableActions,
  trackCallback
}: AnalyticsMiddlewareParameters): (() => Action) => {
  return (): Action => {
    return (next: Dispatch): Dispatch => {
      return (action: Action): Action => {
        // Skip the middleware if the action is not one of the trackable actions
        if (!trackableActions.includes(action.type)) return next(action)

        trackCallback(action)

        return next(action)
      }
    }
  }
}

export default AnalyticsMiddleware
