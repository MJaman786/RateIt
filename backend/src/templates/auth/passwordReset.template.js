import emailLayout from '../layouts/emailLayout.js';

const passwordResetTemplate = ({
    name,
    otp,
    expiryMinutes = 10,
}) => {
    const content = `
        <p>Hello <strong>${name}</strong>,</p>

        <p>
            We received a request to reset your password.
        </p>

        <div
            style="
                background:#fef2f2;
                border:2px dashed #dc2626;
                border-radius:10px;
                text-align:center;
                padding:20px;
                margin:30px 0;
            "
        >
            <div
                style="
                    font-size:36px;
                    font-weight:bold;
                    color:#dc2626;
                    letter-spacing:8px;
                "
            >
                ${otp}
            </div>
        </div>

        <p>
            OTP expires in
            <strong>${expiryMinutes} minutes</strong>.
        </p>

        <p>
            If you didn't request this,
            secure your account immediately.
        </p>
    `;

    return emailLayout({
        title: 'Password Reset',
        heading: 'Reset Your Password',
        content,
    });
};

export default passwordResetTemplate;