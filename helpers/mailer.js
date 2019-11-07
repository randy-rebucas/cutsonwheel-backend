
const nodemailer = require('nodemailer');
// async..await is not allowed in global scope, must use a wrapper
exports.sendMail = async(toAddress, subject, content, next) => {
    var transporter = nodeMailer.createTransport({
      host: 'sg2plcpnl0135.prod.sin2.secureserver.net',
      port: 465,
      secure: true,
      auth: {
          user: 'admin@cutsonwheel.com',       // sender's gmail id
          pass: '?.&W;S$n8@[7'     // sender password
      }
    });

    var mailOptions = {
      from: "cutsonwheel <admin@cutsonwheel.com>",
      to: toAddress,
      replyTo: fromAddress,
      subject: subject,
      html: content
    };

    let info = await transporter.sendMail(mailOptions, next);
    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
