import emailLayout from "../layouts/emailLayout.js";

const twoFactorTemplate = ({
    name,
    otp,
}) => {
    const content = `
        <p>Hello <strong>${name}</strong>,</p>

        <p>
            Use the verification code below to
            complete login.
        </p>

        <div
            style="
                background:#ecfeff;
                border:2px dashed #0891b2;
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
                    color:#0891b2;
                    letter-spacing:8px;
                "
            >
                ${otp}
            </div>
        </div>
    `;

    return emailLayout({
        title: 'Two-Factor Authentication',
        heading: 'Security Verification',
        content,
    });
};

export default twoFactorTemplate;