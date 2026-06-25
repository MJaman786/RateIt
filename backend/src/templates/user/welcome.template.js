import emailLayout from '../layouts/emailLayout.js';

const welcomeTemplate = ({ name }) => {
    const content = `
        <p>Hello <strong>${name}</strong>,</p>

        <p>
            Welcome to our platform.
            Your account is now active.
        </p>

        <div
            style="
                background:#eff6ff;
                border-left:5px solid #2563eb;
                padding:20px;
                margin:25px 0;
            "
        >
            We're excited to have you onboard.
        </div>
    `;

    return emailLayout({
        title: 'Welcome',
        heading: 'Welcome Aboard 🎉',
        content,
    });
};

export default welcomeTemplate;