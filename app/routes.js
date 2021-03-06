'use strict';

const Router = require('koa-router');
const homeController = require('./controllers/home');
const randoController = require('./controllers/rando');
const authoController = require('./controllers/auth0');
const worldController = require('./controllers/world');
const router = new Router();
router.get('/', homeController.welcome);
router.get('/spec', homeController.showSwaggerSpec);
router.get('/rando', randoController.rando);
router.get('/noise/:resolution/:word/:zoom', randoController.noise);

console.log('worldController: ', worldController);
router.get('/api/worlds/:sub', worldController.list);
router.post('/api/worlds/:sub', worldController.create);

module.exports = router;
