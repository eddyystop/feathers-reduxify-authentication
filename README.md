# feathers-reduxify-authentication
Wrap feathers.authentication so it works transparently with Redux, as well as authentication, authorization packages for React-Router.

[![Build Status](https://travis-ci.org/eddyystop/feathers-reduxify-authentication.svg?branch=master)](https://travis-ci.org/eddyystop/feathers-reduxify-authentication)
[![Coverage Status](https://coveralls.io/repos/github/eddyystop/feathers-reduxify-authentication/badge.svg?branch=master)](https://coveralls.io/github/eddyystop/feathers-reduxify-authentication?branch=master)

> Work with standard `feathers.authentication` on the client.
> Dispatch feathers authentication to Redux.
> Integrate with `react-router` and `react-router-redux`.
> Use popular Redux, React-Router authentication and authorization packages such as
[redux-auth-wrapper](https://github.com/mjrussell/redux-auth-wrapper)

Transfering production code here. Wait for 0.1.0.

## Code Example

To do.

```javascript
const feathersReduxifyAuthentication = require('feathers-reduxify-authentication');
```

## <a name="motivation"></a> Motivation

To do.

## <a name="installation"></a> Installation

Install [Nodejs](https://nodejs.org/en/).

Run `npm install feathers-reduxify-authentication --save` in your project folder.

You can then require the utilities.

`/src` on GitHub contains the ES6 source.

## <a name="apiReference"></a> API Reference

Each module is fully documented.

This package does some of the heavy lifting in
[feathers-starter-react-redux-login-roles](https://github.com/eddyystop/feathers-starter-react-redux-login-roles)
Review `client/feathers/index.js`, `client/reducers/index.js` and `client/index.js`.

## <a name="tests"></a> Tests

`npm test` to run tests.

`npm run cover` to run tests plus coverage.

## <a name="contribution"></a> Contributing

[Contribute to this repo.](./CONTRIBUTING.md)

[Guide to ideomatic contributing.](https://github.com/jonschlinkert/idiomatic-contributing)

## <a name="changeLog"></a> Change Log

[List of notable changes.](./CHANGELOG.md)

## <a name="license"></a> License

MIT. See LICENSE.