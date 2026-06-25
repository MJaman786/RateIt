const emailLayout = ({
    title,
    heading,
    content,
}) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8" />
    </head>
    <body
        style="
            margin:0;
            padding:0;
            background:#f4f7fb;
            font-family:Arial,Helvetica,sans-serif;
        "
    >
        <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="padding:40px 0;"
        >
            <tr>
                <td align="center">

                    <table
                        width="600"
                        cellpadding="0"
                        cellspacing="0"
                        style="
                            background:#ffffff;
                            border-radius:12px;
                            overflow:hidden;
                            box-shadow:0 4px 20px rgba(0,0,0,0.08);
                        "
                    >

                        <!-- Header -->
                        <tr>
                            <td
                                style="
                                    background:#2563eb;
                                    padding:25px;
                                    text-align:center;
                                    color:white;
                                "
                            >
                                <h1 style="margin:0;">
                                    ${title}
                                </h1>
                            </td>
                        </tr>

                        <!-- Body -->
                        <tr>
                            <td style="padding:40px;">
                                <h2
                                    style="
                                        margin-top:0;
                                        color:#111827;
                                    "
                                >
                                    ${heading}
                                </h2>

                                ${content}
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td
                                style="
                                    background:#f9fafb;
                                    padding:20px;
                                    text-align:center;
                                    font-size:12px;
                                    color:#6b7280;
                                "
                            >
                                © ${new Date().getFullYear()} Your App.
                                All rights reserved.
                            </td>
                        </tr>

                    </table>

                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};

export default emailLayout;