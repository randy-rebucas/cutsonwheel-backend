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
const userController = require('../controllers/user');

router.get('', userController.getAll);

router.get('/classified-user/:classificationId', userController.getClassifiedUser)

router.get('/:userId', userController.getOne);

router.post('', checkAuth, userController.create);

router.post('/upload/:userId', extractFile, userController.upload);

router.put('/:userId', userController.update);

router.put('/classification/:userId', userController.updateClassification);

router.delete('/:userIds', checkAuth, userController.delete);

module.exports = router;