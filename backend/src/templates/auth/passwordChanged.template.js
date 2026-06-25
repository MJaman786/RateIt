import emailLayout from '../layouts/emailLayout.js';

const passwordChangedTemplate = ({ name }) => {
    const content = `
        <p>Hello <strong>${name}</strong>,</p>

        <p>
            Your password was changed successfully.
        </p>

        <div
            style="
                background:#ecfdf5;
                border-left:5px solid #16a34a;
                padding:20px;
                margin:25px 0;
            "
        >
            Your account security has been updated.
        </div>

        <p>
            If this wasn't you, contact support immediately.
        </p>
    `;

    return emailLayout({
        title: 'Password Updated',
        heading: 'Password Changed',
        content,
    });
};

export default passwordChangedTemplate;