# feathers-reduxify-authentication
Wrap feathers.authentication so it works transparently with Redux, as well as authentication, authorization packages for React-Router.

[![Build Status](https://travis-ci.org/eddyystop/feathers-reduxify-authentication.svg?branch=master)](https://travis-ci.org/eddyystop/feathers-reduxify-authentication)

- Work with standard `feathers-client.authentication` on the client.
- Dispatch feathers authentication and logout to Redux.
- Integrate with `react-router` and `react-router-redux`.
- Use popular Redux, React-Router authentication and authorization packages for React routing.

Transfering production code here. Wait for 0.1.0.

## Code Examples

- [What we want to be able to do](#todo)
- [Making feathers-client.authentication work with Redux](#reduxifying)
- [Working example](#workingexample)

### <a name="todo"></a> What we want to be able to do

This is typical code for React routing and permissions.

```javascript
import { UserAuthWrapper } from 'redux-auth-wrapper';

// Define permissions
const UserIsAuthenticated = UserAuthWrapper({
  authSelector: (state) => state.auth.user, // BEING ABLE TO DO THIS IS ONE REASON TO USE THIS REPO
  predicate: user => user && user.isVerified,
  ...
});
const UserIsAdmin = UserAuthWrapper({
  authSelector: (state) => state.auth.user, // BEING ABLE TO DO THIS IS ONE REASON TO USE THIS REPO
  predicate: user => user && user.isVerified && user.roles && user.roles.indexOf('admin') !== -1,
  ...
});

// React routing
<Provider store={store}>
  <Router history={history}>
    <Route path="/" component={AppWrapper}>
      <Route path="/user/profilechange"
        component={UserIsAuthenticated(UserProfileChange)} // USER MUST BE AUTHENTICATED
      />
      <Route path="/user/roleschange"
        component={UserIsAuthenticated(UserIsAdmin(UserRolesChange))} // AUTHENTICATED AND ADMIN
      />
    </Route>
  </Router>
</Provider>
```

`require('feathers-client').authentication` cannot be used as-is in this scenario
or other scenarios involving Redux-based projects.

`feathers-reduxify-authentication` wraps `require('feathers-client').authentication`
so it behaves transparently as 100% compatible Redux code.

### <a name="reduxifying"></a> Reduxifying

You wrap `require('feathers-client').authentication`, insert the wrapper's reducer
into Redux's `combineReducers`, and use the wrapper's action creators with Redux's `dispatch`.

Voila, 100% Redux compatible with the current user retained in Redux's `store`.

```javascript
import feathers from 'feathers-client';
import feathersReduxifyAuthentication from 'feathers-reduxify-authentication';

// Configure feathers-client
const app = feathers(). ... .configure(feathers.authentication({ ... });

// Reduxify feathers-authentication
feathersAuthentication = reduxifyAuthentication(app,
  { isUserAuthorized: (user) => user.isVerified } // WE INSIST USER IS 'verified' TO AUTHENTICATE
);

// Add Redux reducer
const rootReducer = combineReducers({ ..., auth: feathersAuthentication.reducer, ...});

// Dispatch actions as needed. Params are the same as for feathers.authentication().
dispatch(feathersAuthentication.authenticate({ type: 'local', email, password })).then().catch();
dispatch(feathersAuthentication.logout());
```

### <a name="workingexample"></a> Working Example

This package is used in
[feathers-starter-react-redux-login-roles](https://github.com/eddyystop/feathers-starter-react-redux-login-roles)
which implements full featured local authentication with user roles, email verification,
forgotten passwords, etc.

You can review how that project uses `feathers-reduxify-authentication`:
- `client/feathers/index.js` configures feathers and reduxifies feathers-client.authentication.
- `client/reducers/index.js` adds our authentication to Redux's reducers.
Our current user will be stored at `state.auth.user`.
- `client/index.js` sets up React routing and permissions.
- `client/screens/Users/UserSignIn/FormContainer.js` contains code to both
authenticate users and to log them out.

## <a name="motivation"></a> Motivation

- Feathers is a great real-time client-server framework.
- Redux is a great state container for the front-end.
- React is a great declarative UI.
- React-Router is a complete routing library for React by React.
- There are several packages
which handle authentication and authorization for redux and React-Router.

This repo let's everyone work together easily.

## <a name="installation"></a> Installation

Install [Nodejs](https://nodejs.org/en/).

Run `npm install feathers-reduxify-authentication --save` in your project folder.

You can then:

```javascript
// ES5
import feathersReduxifyAuthentication from 'feathers-reduxify-authentication';
// ES5
const feathersReduxifyAuthentication = require('feathers-reduxify-authentication');
```

`/src` on GitHub contains the ES6 source.

## <a name="apiReference"></a> API Reference

Each module is fully documented.

Also see [Working example](#workingexample).

## <a name="tests"></a> Build

`npm test` to transpile the ES6 code in `/src` to ES5 in `/lib`.

## <a name="contribution"></a> Contributing

[Contribute to this repo.](./CONTRIBUTING.md)

[Guide to ideomatic contributing.](https://github.com/jonschlinkert/idiomatic-contributing)

## <a name="changeLog"></a> Change Log

[List of notable changes.](./CHANGELOG.md)

## <a name="license"></a> License

MIT. See LICENSE.