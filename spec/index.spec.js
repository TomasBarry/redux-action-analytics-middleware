// @flow

import configureMockStore from 'redux-mock-store'

import AnalyticsMiddleware from '../src'

type State = {|
  someValue: true
|}

declare var jest

const { describe, it, expect } = global

/*
  Default export tests
*/
describe('AnalyticsMiddleware', (): void => {
  describe('when the action is to be tracked', (): void => {
    it('calls the trackCallback argument', (): void => {
      const dummyState = { someValue: true }
      const untrackableAction = {
        type: 'UNTRACKABLE_ACTION'
      }
      const trackableAction = {
        type: 'TRACKABLE_ACTION'
      }
      const trackCallback = jest.fn()
      const middlewares = [
        AnalyticsMiddleware({
          trackCallback,
          trackableActions: ['TRACKABLE_ACTION']
        })
      ]
      const mockStore = configureMockStore(middlewares)
      const store = mockStore(dummyState)

      store.dispatch(untrackableAction)
      store.dispatch(trackableAction)
      expect(trackCallback).toBeCalledWith(
        trackableAction,
        dummyState,
        dummyState
      )
    })
  })

  describe('when the action is not to be tracked', (): void => {
    it('does not call the trackCallback argument', (): void => {
      const untrackableAction = {
        type: 'UNTRACKABLE_ACTION'
      }
      const trackCallback = jest.fn()
      const middlewares = [
        AnalyticsMiddleware<State>({
          trackCallback,
          trackableActions: []
        })
      ]
      const mockStore = configureMockStore(middlewares)
      const store = mockStore()

      store.dispatch(untrackableAction)
      return expect(trackCallback).not.toHaveBeenCalled()
    })
  })
})
