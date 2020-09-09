const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    host: 'smtp.mailgun.org',
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAILGUN_USER,
        pass: process.env.MAILGUN_PASS
    },
    tls: {
        rejectUnauthorized: true
    }
});

module.exports = {
    sendEmail(from, to, subject, html) {
        return new Promise((resolve, reject) => {
            transport.sendMail({ from, subject, to, html}, (err, info) => {
                if(err) {reject(err)};

                resolve(info);
            });
        });
    }
}