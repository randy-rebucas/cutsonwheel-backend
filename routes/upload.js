const express = require('express');

const UploadController = require('../controllers/upload');

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

const router = express.Router();

router.get('', UploadController.getAll);

router.get('/:uploadId', UploadController.getOne);

router.post('', UploadController.create); // checkAuth,

router.put('/:uploadId', checkAuth, UploadController.update);

router.delete('/:uploadId', checkAuth, UploadController.delete);

module.exports = router;