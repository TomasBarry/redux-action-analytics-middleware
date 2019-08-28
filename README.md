# redux-action-analytics-middleware

_A middleware to trigger analytics for white-listed actions_

[![npm](https://img.shields.io/npm/dt/redux-action-analytics-middleware.svg)](https://www.npmjs.com/package/redux-action-analytics-middleware)

## Description

The aim of this project is to make the inclusion of analytics in a Redux as seamless as possible for an Engineer, and as transparent as possible for a Product Manager. This project achieves that aim by consolidating the location of analytics to [Redux middleware](https://redux.js.org/advanced/middleware) and by keeping the project decoupled from any specific analytics tool.

This project enables the Engineer to abstract away most, if not all, analytics logic and a Product Manager with read access to the codebase should only have a single file to look at to know what actions are being tracked in the Redux application.

## Installation

Install the project using `npm`:

```bash
npm install redux-action-analytics-middleware
```

Or by using `yarn`:

```bash
yarn add redux-action-analytics-middleware
```

## Type Signatures

The parameters to `AnalyticsMiddleware` are defines as:

```es6
// @flow

type AnalyticsMiddlewareParameters<State> = {|
  trackCallback: (Action, State, State) => void,
  trackableActions: Array<TrackableActionType>
|}
```

Where a `TrackableActionType` is a type alias for a `string`.

`trackableActions` is the array of white-listed action types. The `trackCallback` is the dependency injected analytics call. It is called when the action passing through the middleware is one of the white-listed action types. The second argument to `trackCallback` is the state before the action occurs, while the third argument is the state after the action occurs. This allows an engineer to provide much richer analytics given the context of what changed and how in the Redux state.


## Usage

Wherever middleware is defined in your redux application, you simply need to import `AnalyticsMiddleware` and configure it with your set of white-listed actions as well as the analytics tracking callback.

The most basic implementation would be logging the white-listed actions to the console:

```es6
import AnalyticsMiddleware from 'redux-action-analytics-middleware'

const middlewares = [
  AnalyticsMiddleware({
    trackCallback: console.log,
    trackableActions: ['TRACKABLE_ACTION']
  })
]
```

With the above example, every time an action with the type `'TRACKABLE_ACTION'` is dispatched to the reducer, that action will be logged to the console.

A more complete example could be:

```es6
// @flow

/**
 * Assume the state is:
 *
 * {
 *   someKey: true
 * }
 *
 * Where someKey has a signature of:
 *
 * type State = {|
 *   someKey: boolean
 * |}
 *
 * Assume an action with the type `TOGGLE_SOME_KEY` flips the value of
 * `someKey` in the Redux state.
 */
import AnalyticsMiddleware from 'redux-action-analytics-middleware'

import type { Action } from 'redux'

const trackCallback = <State>(
  action: Action,
  preActionState: State,
  postActionState: State
): void => {
  console.log(action) // { type: 'TOGGLE_SOME_KEY' }
  console.log(preActionState) // { someKey: true }
  console.log(postActionState) // { someKey: false }
}

const middlewares = [
  AnalyticsMiddleware({
    trackCallback,
    trackableActions: ['TOGGLE_SOME_KEY']
  })
]
```

Notice how we are making use of [Flow Generics](https://flow.org/en/docs/types/generics/) to tell `AnalyticsMiddleware` the type of the Redux state.

It is up to the Engineer to decide how they would like to build the `AnalyticsMiddleware` object as it is highly likely that as the Redux project grows in size, and an increasing number of actions are added to the white-list, the inline configuration of `AnalyticsMiddleware` becomes a burden.

`redux-action-analytics-middleware` **does not** strip any data from white-listed actions. If an action is white-listed and contains sensitive information then the `trackCallback` method should account for this. `redux-action-analytics-middleware` will not do this for you. It is intended to be as decoupled as possible from the specifics of analytics. It simply tracks (through `trackCallback`) the white-listed actions (through `trackableActions`).

## Additional Notes and Thoughts

The source code for this project makes use of [Flow](https://flow.org) for type checking. Currently, `trackableActions` has `Array<TrackableActionType>` type signature and a `TrackableActionType` is a type alias for a `string`.

As it is recommended that the type key of an action should be a `string` this project expects the `trackableActions` to be an array of strings. However, it would be possible, to make use of [Flow Generics](https://flow.org/en/docs/types/generics/) to allow for non-serializable types to be used as the `TrackableActionType` instead of it simply being an alias for a `string`.

## Potential Future Changes

1) In order to make it easier for any engineering team to incorporate this package into their Redux application we may add documentation related to specific analytics tools. Although the implementations will largely be similar, the documentation will assist engineers
2) As mentioned previously, [Flow Generics](https://flow.org/en/docs/types/generics/) may be utilized further to allow for the type of a `TrackableActionType` to be injected by the implementer
3) Documentation could be added to provide a suggested _best practice_ approach to the consolidation of analytics calls when making use of this package
