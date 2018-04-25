'use strict';

const Router = require('koa-router');
const homeController = require('./controllers/home');
const snapshotController = require('./controllers/shapshot');

const router = new Router();
router.get('/', homeController.welcome);
router.get('/snapshot/:level', snapshotController.shapshot);
router.get('/spec', homeController.showSwaggerSpec);

module.exports = router;
