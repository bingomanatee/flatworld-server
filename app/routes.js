'use strict';

const Router = require('koa-router');
const homeController = require('./controllers/home');
const randoController = require('./controllers/rando');

const router = new Router();
router.get('/', homeController.welcome);
router.get('/spec', homeController.showSwaggerSpec);
router.get('/rando', randoController.rando);
router.get('/noise/:resolution/:word/:zoom', randoController.noise);
module.exports = router;
