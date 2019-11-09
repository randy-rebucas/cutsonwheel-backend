const slugify = require('slugify');
const Classification = require('../models/classification');

exports.create = async(req, res, next) => {
    try {
        /**
         * check for existing name
         */
        let nameCheck = await Classification.findOne({ name: req.body.name });
        if (nameCheck) {
            throw new Error('Something went wrong. Classification already in database!');
        }
        /**
         * Set entities on collection
         */
        const newClassification = new Classification({
            name: req.body.name,
            slug: slugify(req.body.name, {
                replacement: '-', // replace spaces with replacement
                remove: null, // regex to remove characters
                lower: true, // result in lower case
            }),
            description: req.body.description,
            services: req.body.services
        });

        let classification = await newClassification.save();
        if (!classification) {
            throw new Error('Something went wrong.Cannot save classification data!');
        }

        res.status(200).json({
            message: 'Classification added successfully',
            classifications: {
                ...classification,
                id: classification._id,
            }
        });
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.update = async(req, res, next) => {
    try {

        const updatedClassification = new Classification({
            _id: req.params.classificationId,
            name: req.body.name,
            slug: slugify(req.body.name, {
                replacement: '-', // replace spaces with replacement
                remove: null, // regex to remove characters
                lower: true, // result in lower case
            }),
            description: req.body.description,
            services: req.body.services
        });

        let classification = await Classification.findOneAndUpdate({ _id: req.params.classificationId }, updatedClassification, { new: true });
        if (!classification) {
            throw new Error('Something went wrong.Cannot update classification data!');
        }
        res.status(200).json({ message: classification.name + ' update successful!' });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }

};

exports.upload = async(req, res, next) => {
    try {

        const url = req.protocol + '://' + req.get('host');
        const updatedClassification = new Classification({
            _id: req.body.classificationId,
            image: url + '/files/' + req.file.filename
        });

        let user = await Classification.updateOne({ _id: req.params.classificationId }, updatedClassification);
        if (!user) {
            throw new Error('Error in updating classification!');
        }

        res.status(200).json({
            image: updatedClassification.image,
            message: 'Classification image updated!'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.getAll = async(req, res, next) => {
    try {

        const pageSize = +req.query.pagesize;
        const currentPage = +req.query.page;
        const query = Classification.find();
        if (pageSize && currentPage) {
            query.skip(pageSize * (currentPage - 1)).limit(pageSize);
        }
        let classifications = await query.exec();
        let classificationCount = await Classification.countDocuments();

        res.status(200).json({
            message: 'Classification fetched successfully!',
            classifications: classifications,
            counts: classificationCount
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.getOne = async(req, res, next) => {
    try {
        // Classification.
        const classification = await Classification.findOne({ _id: req.params.classificationId }).exec();
        res.status(200).json(classification);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.delete = async(req, res, next) => {
    try {
        /**
         * delete collection
         */
        let classification = await Classification.delete({ _id: req.params.classificationId });
        if (!classification) {
            throw new Error('Error in deleting classification!');
        }
        res.status(200).json({
            message: classification.deletedCount + ' item deleted successfull!'
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};