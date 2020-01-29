const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const sharp = require('sharp');
// const moment = require('moment');
const slugify = require('slugify');

const ObjectId = require('mongoose').Types.ObjectId;

const Auth = require('../models/auth');
const User = require('../models/user');

exports.getAll = async(req, res, next) => {
    try {
        const pageSize = +req.query.pagesize;
        const currentPage = +req.query.page;
        const query = User.find();
        if (pageSize && currentPage) {
            query.skip(pageSize * (currentPage - 1)).limit(pageSize);
        }
        let users = await query.exec();
        let userCount = await User.countDocuments();

        res.status(200).json({
            message: 'Users fetched successfully!',
            users: users,
            counts: userCount
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.getOne = async(req, res, next) => {
    try {
        const user = await User.findOne({ _id: new ObjectId(req.params.userId) }).exec();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.delete = async(req, res, next) => {
    try {
        userIds = req.params.userIds;
        userId = Ids.split(',');

        /**
         * delete auth credentials
         */
        let auth = await Auth.deleteMany({ userId: { $in: userId } });
        if (!auth) {
            throw new Error('Error in deleting auth!');
        }
        /**
         * delete person collection
         */
        let user = await User.deleteMany({ _id: { $in: userId } });
        if (!user) {
            throw new Error('Error in deleting person!');
        }
        res.status(200).json({
            message: user.deletedCount + ' item deleted successfull!'
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.create = async(req, res, next) => {
    try {
        /**
         * check for existing email
         */
        let authCheck = await Auth.findOne({ email: req.body.email });
        if (authCheck) {
            throw new Error('Something went wrong. Email is in used!');
        }
        /**
         * Set common entities on people collection
         */
        const newUser = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            midlename: req.body.midlename,
            gender: req.body.gender,
            age: req.body.age,
            birthdate: req.body.birthdate,
            status: req.body.status,
            contact: req.body.contact,
            sss: req.body.sss,
            tin: req.body.tin,
            philhealth: req.body.philhealth,
        });
        addressData = req.body.address;
        for (let index = 0; index < addressData.length; index++) {
            newUser.address.push(addressData[index]);
        }
        let user = await newUser.save();
        if (!user) {
            throw new Error('Something went wrong.Cannot save user data!');
        }
        /**
         * Set login credentials in auth collection
         */
        const salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(req.body.password, salt);
        const authCredentials = new Auth({
            email: req.body.email,
            password: hash,
            userId: user._id
        });
        let auth = await authCredentials.save();
        if (!auth) {
            throw new Error('Something went wrong.Cannot save auth collection!');
        }

        res.status(200).json({
            message: 'User added successfully',
            users: {
                ...user,
                id: user._id,
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
        /**
         * Set common entities on people collection
         */
        let user = await User.findOneAndUpdate({ _id: req.params.userId }, req.body, { new: true });
        if (!user) {
            throw new Error('Something went wrong.Cannot update user data!');
        }
        res.status(200).json({ message: req.body.name.firstname + ' Update successful!' });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }

};

exports.search = async(req, res, next) => {
    try {

        let userType = await Type.findOne({ slug: 'patients' }).exec();
        let myUsers = await MyUser.find()
            .populate({
                path: 'userId',
                populate: {
                    path: 'personId',
                    model: Person
                }
            }).where('userType', userType._id);

        const result = [];
        myUsers.forEach(element => {
            result.push({ id: element._id, name: element.userId.personId.firstname + ', ' + element.userId.personId.lastname });
        });

        let count = await MyUser.countDocuments({ 'userType': userType._id });

        res.status(200).json({
            total: count,
            results: result
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

exports.upload = async(req, res, next) => {
    try {
        const url = req.protocol + '://' + req.get('host');
        let selectedAvatar = await User.findOneAndUpdate({
            _id: req.params.userId
        }, { $set: { 'photoUrl': url + '/files/' + req.file.filename } }, { new: true });
        if (!selectedAvatar) {
            throw new Error('Error in updating user!');
        }

        res.status(200).json({
            avatar: selectedAvatar.avatar,
            message: 'Profile picture updated!'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.updateClassification = async(req, res, next) => {
    try {

        let selectedClassification = await User.updateOne({
            _id: req.params.userId
        }, { $set: { 'classification': req.body.classification } });
        if (!selectedClassification) {
            throw new Error('Error in updating user!');
        }

        res.status(200).json({
            classification: selectedClassification.classification,
            message: 'Profile classification updated!'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

exports.getClassifiedUser = async(req, res, next) => {
    try {
        let classifiedUsers = await User.find({ classification: req.params.classificationId }).select('firstname lastname avatar').exec();

        res.status(200).json({
            classifiedUsers: classifiedUsers,
            count: classifiedUsers.length
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

exports.getTodaysBirthday = async(req, res, next) => {
    try {
        const birthdays = await MyUser.aggregate([{
                $lookup: {
                    from: 'auths', // other table name
                    localField: 'userId', // name of users table field
                    foreignField: 'userId', // name of userinfo table field
                    as: 'auths' // alias for userinfo table
                }
            },
            {
                $redact: {
                    $cond: [{
                            $eq: [
                                { $month: "$user.birthdate" },
                                { $month: new Date() }
                            ]
                        },
                        "$$KEEP",
                        "$$PRUNE"
                    ]
                }
            }
        ]);
        res.status(200).json({
            users: birthdays
        });

    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
}