# redux-action-analytics-middleware

_A middleware to trigger analytics for white-listed actions_

[![npm](https://img.shields.io/npm/dt/reverse-number.svg)](https://www.npmjs.com/package/reverse-number)

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

## Usage

Wherever middleware is defined in your redux application, you simply need to import `AnalyticsMiddleware` and configure it with your set of white-listed actions as well as the analytics tracking callback. The most basic implementation would be logging the white-listed actions to the console:

```es6
import AnalyticsMiddleware from 'redux-action-analytics-middleware'

const middlewares = [
  AnalyticsMiddleware({
    trackCallback: (a) => console.log(a),
    trackableActions: ['TRACKABLE_ACTION']
  })
]
```

It is up to the Engineer to decide how they would like to build the `AnalyticsMiddleware` object as it is highly likely that as the Redux project grows in size, and an increasing number of actions are added to the white-list, the inline configuration of `AnalyticsMiddleware` becomes a burden.

`redux-action-analytics-middleware` **does not** strip any data from white-listed actions. If an action is white-listed and contains sensitive information then the `trackCallback` method should account for this. `redux-action-analytics-middleware` will not do this for you. It is intended to be as decoupled as possible from the specifics of analytics. It simply tracks (through `trackCallback`) the white-listed actions (through `trackableActions`).

## Additional Notes and Thoughts

The source code for this project makes use of [Flow](https://flow.org) for type checking. Currently, `trackableActions` has `Array<TrackableActionType>` type signature and a `TrackableActionType` is a type alias for a `string`.

As it is recommended that the type key of an action should be a `string` this project expects the `trackableActions` to be an array of strings. However, it would be possible, to make use of [Flow Generics](https://flow.org/en/docs/types/generics/) to allow for non-serializable types to be used as the `TrackableActionType` instead of it simply being an alias for a `string`.
