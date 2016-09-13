
import { createAction, handleActions } from 'redux-actions';
import makeDebug from 'debug';

// handles situation where a logout is dispatched while an authentication is in progress

export default (app, options = {}) => {
  const debug = makeDebug('reducer:authentication');
  debug('instantiate');

  const defaults = {
    isError: 'isError',
    isLoading: 'isLoading', // s/b compatible with feathers-reduxify-service::getServicesStatus
    isSignedIn: 'isSignedIn',
    user: 'user',
    token: 'token',
    PENDING: 'PENDING',
    FULFILLED: 'FULFILLED',
    REJECTED: 'REJECTED',
    isUserAuthorized: (/* user */) => true,
    assign: {
      verifyExpires: undefined,
      verifyToken: undefined,
      resetExpires: undefined,
      resetToken: undefined,
    },
  };
  const opts = Object.assign({}, defaults, options);

  const reducer = {
    [`SERVICES_AUTHENTICATION_AUTHENTICATE_${opts.PENDING}`]: (state, action) => {
      debug(`redux:SERVICES_AUTHENTICATION_AUTHENTICATE_${opts.PENDING}`, action);
      return ({
        ...state,
        [opts.isError]: null,
        [opts.isLoading]: true,
        [opts.isSignedIn]: false,
        [opts.user]: null,
        [opts.token]: null,
        ignorePendingAuth: false,
      });
    },

    [`SERVICES_AUTHENTICATION_AUTHENTICATE_${opts.FULFILLED}`]: (state, action) => {
      debug(`redux:SERVICES_AUTHENTICATION_AUTHENTICATE_${opts.FULFILLED}`, action);
      const user = action.payload.data;

      if (state.ignorePendingAuth) {
        // A logout was dispatched between the authentication being started and completed
        app.logout();

        return {
          ...state,
          [opts.isError]: null,
          [opts.isLoading]: false,
          [opts.isSignedIn]: false,
          [opts.data]: null,
          [opts.token]: null,
          ignorePendingAuth: false,
        };
      }

      if (!opts.isUserAuthorized(user)) {
        // feathers authenticated the user but the app is rejecting
        app.logout();

        return {
          ...state,
          [opts.isError]: new Error('User is not verified.'),
          [opts.isLoading]: false,
          [opts.isSignedIn]: false,
          [opts.data]: null,
          [opts.token]: null,
          ignorePendingAuth: false,
        };
      }

      return {
        ...state,
        [opts.isError]: null,
        [opts.isLoading]: false,
        [opts.isSignedIn]: true,
        [opts.user]: Object.assign({}, user, opts.assign),
        [opts.token]: action.payload.token,
        ignorePendingAuth: false,
      };
    },

    [`SERVICES_AUTHENTICATION_AUTHENTICATE_${opts.REJECTED}`]: (state, action) => {
      debug(`redux:SERVICES_AUTHENTICATION_AUTHENTICATE_${opts.REJECTED}`, action);
      return {
        ...state,
        // action.payload = { name: "NotFound", message: "No record found for id 'G6HJ45'",
        //   code:404, className: "not-found" }
        [opts.isError]: action.payload,
        [opts.isLoading]: false,
        [opts.isSignedIn]: false,
        [opts.data]: null,
        [opts.token]: null,
        ignorePendingAuth: false,
      };
    },

    SERVICES_AUTHENTICATION_LOGOUT: (state, action) => {
      debug('redux:SERVICES_AUTHENTICATION_LOGOUT', action);
      app.logout();

      return ({
        ...state,
        [opts.isError]: null,
        [opts.isLoading]: null,
        [opts.isSignedIn]: false,
        [opts.user]: null,
        // Ignore the result if an authentication has been started
        ignorePendingAuth: state.isLoading,
      });
    },

    SERVICES_AUTHENTICATION_USER: (state, action) => {
      debug('redux:SERVICES_AUTHENTICATION_USER', action);

      let user = state[opts.user];
      if (user) {
        user = { ...user, ...action.payload };
      }

      return ({
        ...state,
        [opts.isError]: null,
        [opts.isLoading]: null,
        [opts.isSignedIn]: false,
        [opts.user]: user,
        // A logout may be dispatched between the authentication being started and completed
        ignorePendingAuth: false,
      });
    },
  };

  // ACTION TYPES

  const AUTHENTICATE = 'SERVICES_AUTHENTICATION_AUTHENTICATE';
  const LOGOUT = 'SERVICES_AUTHENTICATION_LOGOUT';
  const USER = 'SERVICES_AUTHENTICATION_USER';

  return {
    // ACTION CREATORS
    // Note: action.payload in reducer will have the value of .data below
    authenticate: createAction(
      AUTHENTICATE, (p) => ({ promise: app.authenticate(p), data: undefined })
    ),
    logout: createAction(LOGOUT),
    user: createAction(USER),

    // REDUCER
    reducer: handleActions(
      reducer,
      {
        [opts.isError]: null,
        [opts.isLoading]: false,
        [opts.isSignedIn]: false,
        [opts.user]: null,
        ignorePendingAuth: false,
      }
    ),
  };
};
