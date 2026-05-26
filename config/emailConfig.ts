const nodemailer = require("nodemailer");
require("dotenv").config();
export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const forgotPasswordEmailTemplate = (
  resetUrl: string,
  userName = "there",
) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset your password</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f6f8fb;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f6f8fb;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(15,23,42,0.08);">
            <tr>
              <td style="padding:40px 32px 24px 32px;text-align:center;background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);color:#ffffff;">
                <h1 style="margin:0;font-size:28px;line-height:1.2;">Password reset request</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;color:#0f172a;">
                <p style="margin:0 0 16px 0;font-size:16px;line-height:1.6;">Hi ${userName},</p>
                <p style="margin:0 0 16px 0;font-size:16px;line-height:1.6;">We received a request to reset your password. Click the button below to choose a new one.</p>
                <div style="text-align:center;margin:32px 0;">
                  <a href="${resetUrl}" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:999px;font-size:16px;font-weight:700;">Reset password</a>
                </div>
                <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#475569;">If the button does not work, copy and paste this link into your browser:</p>
                <p style="margin:0 0 24px 0;word-break:break-all;font-size:14px;line-height:1.6;color:#2563eb;">${resetUrl}</p>
                <p style="margin:0;font-size:14px;line-height:1.6;color:#475569;">If you did not request a password reset, you can ignore this email and your password will stay the same.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};
