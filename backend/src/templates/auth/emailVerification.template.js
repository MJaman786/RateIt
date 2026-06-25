import emailLayout from '../layouts/emailLayout.js';

const emailVerificationTemplate = ({
    name,
    otp,
    expiryMinutes = 10,
}) => {
    const content = `
        <p>Hello <strong>${name}</strong>,</p>

        <p>
            Thank you for registering.
            Please verify your email address.
        </p>

        <div
            style="
                background:#eff6ff;
                border:2px dashed #2563eb;
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
                    color:#2563eb;
                    letter-spacing:8px;
                "
            >
                ${otp}
            </div>
        </div>

        <p>
            This OTP expires in
            <strong>${expiryMinutes} minutes</strong>.
        </p>
    `;

    return emailLayout({
        title: 'Email Verification',
        heading: 'Verify Your Email',
        content,
    });
};

export default emailVerificationTemplate;