const express = require('express');
const router = express.Router();
/**
 * loads middlewares
 */
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');
/**
 * load controller
 */
const classificationController = require('../controllers/classification');

router.get('', classificationController.getAll);

router.get('/:classificationId', classificationController.getOne);

router.post('', extractFile, classificationController.create);

router.post('/upload/:classificationId', extractFile, classificationController.upload);

router.put('/:classificationId', classificationController.update);

router.delete('/:classificationId', checkAuth, classificationController.delete);

module.exports = router;
