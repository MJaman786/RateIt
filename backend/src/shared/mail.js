import nodemailer from 'nodemailer';
import envConfig from '../config/env.config.js';

console.log("EMAIL:", envConfig.GOOGLE_USER_EMAIL);
console.log("PASSWORD EXISTS:", !!envConfig.GOOGLE_APP_PASSWORD);

// ✅ Configure transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: envConfig.GOOGLE_USER_EMAIL,
        pass: envConfig.GOOGLE_APP_PASSWORD
        // type: 'OAuth2',
        // clientId: envConfig.GOOGLE_CLIENT_ID,
        // clientSecret: envConfig.GOOGLE_CLIENT_SECRET,
        // refreshToken: envConfig.GOOGLE_REFRESH_TOKEN,
    },
});

// ✅ Verify transporter connection
transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to email server:', error);
    } else {
        console.log('✅ Email server is ready to send messages');
    }
});

// ✅ Send Email Function
export const sendEmail = async ({
    to,
    subject = 'This is welcome mail',
    text = '',
    html = '',
}) => {
    try {
        const mailOptions = {
            from: `"Your App Name" <${envConfig.GOOGLE_USER_EMAIL}>`,
            to,
            subject,
            text,
            html,
        };

        const info = await transporter.sendMail(mailOptions);

        console.log('Email sent successfully:', info.messageId);

        return info;
    } catch (error) {
        console.error('Email sending failed:', error);
        throw error;
    }
};

export default transporter;