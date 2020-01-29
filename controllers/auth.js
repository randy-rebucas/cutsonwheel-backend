const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Auth = require('../models/auth');
const User = require('../models/user');

const nodeMailer = require('nodemailer');
// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_ID; //'AC51274904cf052c754e3bcc7d6c97d1dc';
const authToken = process.env.TWILIO_AUTH_TOKEN; // 'adb599c6f94480d218567c17553f131c';
const client = require('twilio')(accountSid, authToken);

var _jade = require('jade');
var fs = require('fs');

exports.register = async(req, res, next) => {
    try {

        /**
         * check for existing email
         */
        let authCheck = await Auth.findOne({ email: req.body.email });
        if (authCheck) {
            throw new Error('Something went wrong. Email is in used!');
        }

        /**
         * Set extended entities from poeple to users collection
         */
        const newUser = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname
        });
        let user = await newUser.save();
        if (!user) {
            throw new Error('Something went wrong.Cannot save user!');
        }

        /**
         * Set login credentials in auth collection
         */
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        const authCredentials = new Auth({
            email: req.body.email,
            password: hash,
            userId: user._id
        });
        let auth = await authCredentials.save();
        if (!auth) {
            throw new Error('Something went wrong.Cannot save login credentials!');
        }

        // specify jade template to load
        var template = process.cwd() + '/views/mail/welcome.jade';
        var context = {
            email: req.body.email,
            password: req.body.password,
            site_name: 'cutsonwheel',
            site_origin: req.protocol + '://' + req.get('host')
        };
        // get template from file system
        fs.readFile(template, 'utf8', async function(err, file) {
            if (err) {
                //handle errors
                console.log('ERROR!');
                return res.send('ERROR!');
            } else {
                //compile jade template into function
                var compiledTmpl = _jade.compile(file, { filename: template });
                // get html back as a string with the context applied;
                var content = compiledTmpl(context);

                var transporter = nodeMailer.createTransport({
                    host: 'sg2plcpnl0135.prod.sin2.secureserver.net',
                    port: 465,
                    secure: true,
                    auth: {
                        user: 'admin@cutsonwheel.com', // sender's gmail id
                        pass: '?.&W;S$n8@[7' // sender password
                    }
                });

                let mailOptions = {
                    from: 'cutsonwheel <admin@cutsonwheel.com>',
                    to: req.body.email,
                    subject: 'New Account Registration',
                    html: content
                }
                let info = await transporter.sendMail(mailOptions);
                if (!info) {
                    throw new error('Something went wrong! Sending email failed!')
                }

                res.status(200).json({
                    message: 'Registered successfully!',
                    userId: auth.userId,
                });
            }
        });


    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
}

exports.check = async(req, res, next) => {
    try {
        let verificationCheck = await client
            .verify
            .services(process.env.TWILIO_SERVICE_ID)
            .verificationChecks
            .create({
                to: req.body.phoneNumber, // '+639658155713', // req.body.phoneNumber
                code: req.body.code
            });

        // verify set session
        console.log(verificationCheck);

        if (verificationCheck.status != 'approved') {
            throw new Error('Invalid verification code entered!');
        }

        let user = await User.findOne({ phoneNumber: req.body.phoneNumber });
        // check if number registered
        if (!user) {
            /**
             * Set extended entities from poeple to users collection
             */
            const newUser = new User({
                phoneNumber: req.body.phoneNumber
            });
            user = await newUser.save();

            if (!user) {
                throw new Error('Something went wrong.Cannot save user!');
            }
        }

        let token = await jwt.sign({
                phoneNumber: user.phoneNumber,
                userId: user._id
            },
            process.env.JWT_KEY, {}
        );

        res.status(200).json({
            token: token,
            userId: user._id,
            userPhone: user.phoneNumber
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

exports.verify = async(req, res, next) => {
    try {
        client
            .verify
            .services(process.env.TWILIO_SERVICE_ID)
            .verifications
            .create({
                to: req.body.phoneNumber, // '+639658155713', // req.body.phoneNumber
                channel: 'sms'
            })
            .then((response) => {
                // verify set session
                console.log(response)
                res.status(200).send(response);
            });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }

}