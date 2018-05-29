const _ = require('lodash');
const axios = require('axios');
const config = require('../../config');

const AUTHO_TOKEN_REDIS_PATH = 'auth0/server/token';

module.exports = (bottle) => {

  bottle.constant('AUTH0_CLIENT_ID', process.env.AUTH0_CLIENT_ID);
  bottle.constant('AUTH0_CLIENT_SECRET', process.env.AUTH0_CLIENT_ID);
  bottle.constant('AUTH0_HANDSHAKE', process.env.AUTH0_HANDSHAKE);

  bottle.constant('HOST', config.host);
  bottle.constant('PORT', config.port);

  bottle.constant('AUTH0_TOKEN_EXPIRATION_SECS', 60 * 60) // one hour

  /**
   * triggers a request for an auth0 token
   */
  bottle.factory('requestAuth0token', (container) => {
    return () => axios({
      url: 'https://wonderlandabs.auth0.com/oauth/token',
      method: 'post',
      headers: {'content-type': 'application/json'},
      data: {
        grant_type: 'client_credentials',
        scope: 'profile',
        response_type: 'code',
        client_id: container.AUTH0_CLIENT_ID,
        client_secret: container.AUTH0_CLIENT_SECRET,
        'audience': 'https://wonderlandabs.auth0.com/api/v2/'
      }
    });
  });

  /**
   * This will be called by the koa endpoint
   * that gets a response from the Auth0 redirect.
   */
  bottle.factory('setAuth0token', (container) => {
    const {redis} = container;

    return (value) => redis.set('auth0token', value, 'EX', container.AUTH0_TOKEN_EXPIRATION_SECS);
  });


  /**
   * get a token stored in the redis database.
   * note, it is stored with expiration, so it
   * may need to be re-pulled from time to time.
   */
  bottle.factory('retrieveAuth0token', (container) => {
    const {redis} = container;

    return () => redis.get(AUTHO_TOKEN_REDIS_PATH)
  })

  /**
   * gets the token; either
   * 1) pulls a previously retrieved token from the redis DB
   * 2) sends a request for an auth0 token from the API, then wait for it to be gotten.
   *
   * if there are any redis failures, or if the response takes too long, an error is passed to fail.
   * Otherwise, the resolve will ultimately get the token.
   */
  bottle.factory('getAuth0token', (container) => {

    return () => new Promise((resolve, fail) => {
      container.retrieveAuth0token()
               .then((token) => {
                 if (token) {
                   resolve(token);
                 }
                 // initialize a delayed-satisfaction request for the token
                 container.requestAuth0token()
                          .then((response) => response.json())
                          .then((data) => {
                            console.log('storing auth0 token data: ', data);
                            container.setAuth0response(data)
                              .then(() => resolve(data));
                          })
                   .catch((err) => {
                     console.log('error from requestAuth0token: ', err);
                     fail(err);
                   });
               })
               .catch((err) => fail(err)); // catch on the initial poll.
    }); // end promise.
  });

  bottle.factory('putAccount', (container) => {
    const {redis} = container;

    /**
     * note - we don't directly accept accounts through this API. We validate that
     * they exist by directly calling auth0 and if they are present, that they
     * correspond to the input data; if so the server side version is then saved.
     *
     */
    return (account) => container.getAuth0token()
                                 .then((token) => {
                                   if (!(account && _.isObject(account) && account.sub)) {

                                   }
                                 });
  });

}