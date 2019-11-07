const IncomingForm = require('formidable').IncomingForm
const Upload = require('../models/upload');
// const sharp = require('sharp');
const mkdirp = require('mkdirp-promise');

exports.getAll = async(req, res, next) => {
    try {
        const pageSize = +req.query.pagesize;
        const currentPage = +req.query.page;
        const fileQuery = Upload.find({ 'userId': req.query.userId });

        if (pageSize && currentPage) {
            fileQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
        }
        let file = await fileQuery;
        if (!file) {
            throw new Error('Something went wrong.Cannot fetch all files!');
        }
        newFiles = [];
        file.forEach(element => {
            var obj = {
                _id: element._id,
                created: element.createdAt,
                src: element.src,
                thumb: element.thumb,
                type: element.type,
                name: element.name,
                userId: element.userId,
            }
            newFiles.push(obj);
        });

        let count = await Upload.countDocuments({ 'userId': req.query.userId });

        res.status(200).json({
            message: 'Fetched successfully!',
            files: newFiles,
            max: count
        });

    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.update = async(req, res, next) => {
    try {
        const newFile = new Upload({
            _id: req.body.fileId,
            name: req.body.name
        });
        let file = await Upload.updateOne({ _id: req.params.uploadId }, newFile).exec();
        if (!file) {
            throw new Error('Something went wrong.Cannot update the file!');
        }

        res.status(200).json({ message: 'Update successful!' });

    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.getOne = async(req, res, next) => {
    try {
        let file = await Upload.findById(req.params.uploadId);
        if (!file) {
            throw new Error('Something went wrong.Cannot find file id: ' + req.params.uploadId);
        }

        res.status(200).json(file);

    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};


exports.create = async(req, res, next) => {
    try {
        var form = new IncomingForm();
        form.uploadDir = 'files';
        form.keepExtensions = true;
        form.type = 'multipart';
        form.maxFieldsSize = 20 * 1024 * 1024; //10mb
        form.maxFileSize = 200 * 1024 * 1024;
        form.hash = true;
        form.multiples = true;
        // form.on('field', function(name, value) {
        //   // console.log(name + ': ' + value);
        // });

        // form.on('file', (name, file) => {

        // });

        form.on('error', (err) => {
            // console.log(err);
        });

        form.on('end', () => {
            res.json()
        });


        form.parse(req, async function(err, fields, files) {
            const url = req.protocol + '://' + req.get('host');

            const upload = new Upload({
                src: url + '/' + files.file.path,
                name: files.file.name,
                type: files.file.type,
                userId: fields.userId
            });

            let uploads = await upload.save();
            if (!uploads) {
                throw new Error('Error in uploading file!');
            }
        });
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};


exports.delete = async(req, res, next) => {
    try {
        let file = await Upload.deleteOne({ _id: req.params.uploadId }).exec();
        if (!file) {
            throw new Error('Something went wrong. Cannot delete this file!');
        }

        res.status(200).json({ message: 'Deletion successfull!' });

    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};