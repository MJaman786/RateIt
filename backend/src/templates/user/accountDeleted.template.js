import emailLayout from '../layouts/emailLayout.js';

const accountDeletedTemplate = ({
    name,
    deletedAt = new Date().toLocaleString(),
}) => {
    const content = `
        <p>Hello <strong>${name}</strong>,</p>

        <p>
            This email confirms that your account has been permanently deleted.
        </p>

        <div
            style="
                background:#fef2f2;
                border-left:5px solid #dc2626;
                padding:20px;
                margin:25px 0;
                border-radius:8px;
            "
        >
            <strong>Account Deleted</strong><br/>
            Date & Time: ${deletedAt}
        </div>

        <p>
            All associated account data has been scheduled for removal
            according to our data retention policies.
        </p>

        <p>
            If you did not perform this action, please contact our support
            team immediately.
        </p>

        <div
            style="
                background:#fff7ed;
                border-left:5px solid #f59e0b;
                padding:15px;
                margin-top:20px;
                border-radius:8px;
            "
        >
            Security Notice: Unauthorized account deletion may indicate
            that your credentials were compromised.
        </div>
    `;

    return emailLayout({
        title: 'Account Deleted',
        heading: 'Your Account Has Been Deleted',
        content,
    });
};

export default accountDeletedTemplate;