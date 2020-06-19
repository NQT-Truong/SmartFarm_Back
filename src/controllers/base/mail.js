const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'testsmtpmail.h1@gmail.com',
        pass: 'gqtngdjxooiyvgmt'
    }
});

const handlebarOptions = {
    viewEngine: {
        partialsDir: 'src/controllers/base/statics/emails/',
        layoutsDir: 'src/controllers/base/statics/emails/',
        defaultLayout: null,
    },
    viewPath: 'src/controllers/base/statics/emails',
};

transport.use('compile', hbs(handlebarOptions));

const send = (to_email, template, context, done) => {
    const email = {
        from: 'testsmtpmail.h1@gmail.com',
        to: to_email,
        subject: 'Test mail',
        template: template,
        context: context
    };

    transport.sendMail(email, (err, msg) => {
        if(err) { return done(err);}
        return done(null, msg);
    });
};

async function sendMailWarning(emailReceive, content) {
    try {
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'nguyenhocptit@gmail.com',
                pass: 'hoc28031997'
            }
        });
        let mainOptions = {
            from: 'Hoc Nguyen',
            to: emailReceive,
            subject: 'My farm',
            text: 'My farm',
            html: `<b>${content}</b>`
        };
        transporter.sendMail(mainOptions, function (err, info) {
            if (err) {
                log.error(err);
            } else {
                log.info('Message sent: ' + info.response);
            }
        });
    } catch (e) {
        log.error(e);
    }
}

module.exports = {
    transport,
    send,
    sendMailWarning
};
