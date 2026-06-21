const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export const verificationEmailTemplate = (
  name: string,
  verificationUrl: string,
): string => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify Your Email</title>
  <!--[if mso]>
  <noscript>
    <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:48px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Logo / Brand -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#09090b;border-radius:10px;padding:10px 20px;">
                    <span style="font-size:18px;font-weight:700;color:#ffffff;letter-spacing:0.5px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                      Ranok Raihan
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#ffffff;border-radius:16px;box-shadow:0 1px 4px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.04);overflow:hidden;">

              <!-- Top accent bar -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(90deg,#09090b 0%,#27272a 100%);height:4px;font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>

              <!-- Card body -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:44px 48px 40px;">

                <!-- Icon -->
                <tr>
                  <td align="center" style="padding-bottom:24px;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background-color:#f4f4f5;border-radius:50%;width:64px;height:64px;text-align:center;vertical-align:middle;">
                          <div style="width:64px;height:64px;line-height:64px;text-align:center;font-size:28px;">
                            &#9993;
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Heading -->
                <tr>
                  <td align="center" style="padding-bottom:12px;">
                    <h1 style="margin:0;font-size:24px;font-weight:700;color:#09090b;letter-spacing:-0.3px;line-height:1.3;">
                      Verify your email
                    </h1>
                  </td>
                </tr>

                <!-- Subtext -->
                <tr>
                  <td align="center" style="padding-bottom:36px;">
                    <p style="margin:0;font-size:15px;color:#71717a;line-height:1.65;max-width:400px;">
                      Hey <strong style="color:#09090b;">${name}</strong>, thanks for registering on the <strong style="color:#09090b;">Ranok Raihan Portfolio Dashboard</strong>!
                      Please confirm your email address to activate your account.
                    </p>
                  </td>
                </tr>

                <!-- CTA Button -->
                <tr>
                  <td align="center" style="padding-bottom:36px;">
                    <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
                      href="${verificationUrl}" style="height:50px;width:220px;v-text-anchor:middle;" arcsize="16%"
                      fillcolor="#09090b" stroke="f">
                      <w:anchorlock/>
                      <center style="color:#ffffff;font-family:sans-serif;font-size:15px;font-weight:700;">Verify Email Address</center>
                    </v:roundrect>
                    <![endif]-->
                    <!--[if !mso]><!-->
                    <a href="${verificationUrl}"
                      style="display:inline-block;background-color:#09090b;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:15px;font-weight:600;letter-spacing:0.2px;line-height:1;-webkit-text-size-adjust:none;">
                      Verify Email Address
                    </a>
                    <!--<![endif]-->
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="border-top:1px solid #f4f4f5;padding-top:28px;padding-bottom:16px;">
                    <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.5px;">
                      Or copy this link
                    </p>
                    <p style="margin:0;font-size:12px;color:#71717a;word-break:break-all;line-height:1.6;background-color:#fafafa;border-radius:6px;padding:10px 12px;border:1px solid #f4f4f5;">
                      ${verificationUrl}
                    </p>
                  </td>
                </tr>

                <!-- Expiry notice -->
                <tr>
                  <td style="padding-top:8px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background-color:#fff7ed;border-radius:8px;border-left:3px solid #f97316;padding:12px 16px;">
                          <p style="margin:0;font-size:13px;color:#78350f;line-height:1.5;">
                            <strong>This link expires in 15 minutes.</strong>
                            If you didn&rsquo;t create an account, you can safely ignore this email.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:28px;">
              <p style="margin:0 0 6px;font-size:12px;color:#a1a1aa;">
                &copy; ${new Date().getFullYear()} Ranok Raihan &mdash; Portfolio
              </p>
              <p style="margin:0;font-size:12px;color:#d4d4d8;">
                You received this email because an account was created using this address.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

export const welcomeEmailTemplate = (
  name: string,
  email: string,
  temporaryPassword: string,
  loginUrl: string,
): string => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome — Your Account Details</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:48px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Logo / Brand -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#09090b;border-radius:10px;padding:10px 20px;">
                    <span style="font-size:18px;font-weight:700;color:#ffffff;letter-spacing:0.5px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                      Ranok Raihan
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#ffffff;border-radius:16px;box-shadow:0 1px 4px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.04);overflow:hidden;">

              <!-- Top accent bar -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(90deg,#09090b 0%,#27272a 100%);height:4px;font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>

              <!-- Card body -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:44px 48px 40px;">

                <!-- Icon -->
                <tr>
                  <td align="center" style="padding-bottom:24px;">
                    <div style="width:64px;height:64px;line-height:64px;text-align:center;font-size:28px;background-color:#f0fdf4;border-radius:50%;">
                      &#127881;
                    </div>
                  </td>
                </tr>

                <!-- Heading -->
                <tr>
                  <td align="center" style="padding-bottom:12px;">
                    <h1 style="margin:0;font-size:24px;font-weight:700;color:#09090b;letter-spacing:-0.3px;line-height:1.3;">
                      Welcome aboard, ${name}!
                    </h1>
                  </td>
                </tr>

                <!-- Subtext -->
                <tr>
                  <td align="center" style="padding-bottom:32px;">
                    <p style="margin:0;font-size:15px;color:#71717a;line-height:1.65;max-width:400px;">
                      An account has been created for you on the <strong style="color:#09090b;">Ranok Raihan Portfolio Dashboard</strong>. Use the credentials below to log in for the first time.
                    </p>
                  </td>
                </tr>

                <!-- Credentials box -->
                <tr>
                  <td style="padding-bottom:32px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fafafa;border:1px solid #e4e4e7;border-radius:10px;overflow:hidden;">
                      <tr>
                        <td style="padding:20px 24px;border-bottom:1px solid #e4e4e7;">
                          <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.6px;">Email</p>
                          <p style="margin:0;font-size:15px;font-weight:500;color:#09090b;">${email}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:20px 24px;">
                          <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.6px;">Temporary Password</p>
                          <p style="margin:0;font-size:20px;font-weight:700;color:#09090b;font-family:'Courier New',Courier,monospace;letter-spacing:2px;">${temporaryPassword}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- CTA Button -->
                <tr>
                  <td align="center" style="padding-bottom:32px;">
                    <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
                      href="${loginUrl}" style="height:50px;width:180px;v-text-anchor:middle;" arcsize="16%"
                      fillcolor="#09090b" stroke="f">
                      <w:anchorlock/>
                      <center style="color:#ffffff;font-family:sans-serif;font-size:15px;font-weight:700;">Log In Now</center>
                    </v:roundrect>
                    <![endif]-->
                    <!--[if !mso]><!-->
                    <a href="${loginUrl}"
                      style="display:inline-block;background-color:#09090b;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:15px;font-weight:600;letter-spacing:0.2px;line-height:1;-webkit-text-size-adjust:none;">
                      Log In Now
                    </a>
                    <!--<![endif]-->
                  </td>
                </tr>

                <!-- Warning notice -->
                <tr>
                  <td>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background-color:#fef2f2;border-radius:8px;border-left:3px solid #ef4444;padding:12px 16px;">
                          <p style="margin:0;font-size:13px;color:#7f1d1d;line-height:1.5;">
                            <strong>You will be required to change your password</strong> immediately after your first login. Keep these credentials safe and do not share them.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:28px;">
              <p style="margin:0 0 6px;font-size:12px;color:#a1a1aa;">
                &copy; ${new Date().getFullYear()} Ranok Raihan &mdash; Portfolio
              </p>
              <p style="margin:0;font-size:12px;color:#d4d4d8;">
                This email was sent because an admin created an account for you.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

export const newMessageNotificationTemplate = (
  name: string,
  email: string,
  subject: string | undefined,
  message: string,
): string => {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = subject ? escapeHtml(subject) : undefined;
  const safeMessage = escapeHtml(message);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Contact Message</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:48px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Logo / Brand -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#09090b;border-radius:10px;padding:10px 20px;">
                    <span style="font-size:18px;font-weight:700;color:#ffffff;letter-spacing:0.5px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                      Ranok Raihan
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#ffffff;border-radius:16px;box-shadow:0 1px 4px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.04);overflow:hidden;">

              <!-- Top accent bar -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(90deg,#2563eb 0%,#3b82f6 100%);height:4px;font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>

              <!-- Card body -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:44px 48px 40px;">

                <!-- Icon -->
                <tr>
                  <td align="center" style="padding-bottom:24px;">
                    <div style="width:64px;height:64px;line-height:64px;text-align:center;font-size:28px;background-color:#eff6ff;border-radius:50%;">
                      &#128172;
                    </div>
                  </td>
                </tr>

                <!-- Heading -->
                <tr>
                  <td align="center" style="padding-bottom:8px;">
                    <h1 style="margin:0;font-size:24px;font-weight:700;color:#09090b;letter-spacing:-0.3px;line-height:1.3;">
                      New message from your portfolio
                    </h1>
                  </td>
                </tr>

                <!-- Subtext -->
                <tr>
                  <td align="center" style="padding-bottom:32px;">
                    <p style="margin:0;font-size:15px;color:#71717a;line-height:1.65;">
                      Someone just reached out via your contact form.
                    </p>
                  </td>
                </tr>

                <!-- Sender details -->
                <tr>
                  <td style="padding-bottom:24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fafafa;border:1px solid #e4e4e7;border-radius:10px;overflow:hidden;">
                      <tr>
                        <td style="padding:16px 20px;border-bottom:1px solid #e4e4e7;">
                          <p style="margin:0 0 3px;font-size:11px;font-weight:600;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.6px;">From</p>
                          <p style="margin:0;font-size:15px;font-weight:500;color:#09090b;">${safeName}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:16px 20px;border-bottom:1px solid #e4e4e7;">
                          <p style="margin:0 0 3px;font-size:11px;font-weight:600;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.6px;">Email</p>
                          <p style="margin:0;font-size:15px;color:#2563eb;">${safeEmail}</p>
                        </td>
                      </tr>
                      ${safeSubject ? `<tr>
                        <td style="padding:16px 20px;border-bottom:1px solid #e4e4e7;">
                          <p style="margin:0 0 3px;font-size:11px;font-weight:600;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.6px;">Subject</p>
                          <p style="margin:0;font-size:15px;color:#09090b;">${safeSubject}</p>
                        </td>
                      </tr>` : ""}
                    </table>
                  </td>
                </tr>

                <!-- Message body -->
                <tr>
                  <td>
                    <p style="margin:0 0 10px;font-size:11px;font-weight:600;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.6px;">Message</p>
                    <div style="background-color:#fafafa;border:1px solid #e4e4e7;border-radius:10px;padding:20px;font-size:15px;color:#27272a;line-height:1.7;white-space:pre-wrap;word-break:break-word;">
                      ${safeMessage}
                    </div>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:28px;">
              <p style="margin:0 0 6px;font-size:12px;color:#a1a1aa;">
                &copy; ${new Date().getFullYear()} Ranok Raihan &mdash; Portfolio
              </p>
              <p style="margin:0;font-size:12px;color:#d4d4d8;">
                This notification was sent because someone submitted your contact form.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

export const resetPasswordEmailTemplate = (
  name: string,
  resetUrl: string,
): string => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Your Password</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:48px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Logo / Brand -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#09090b;border-radius:10px;padding:10px 20px;">
                    <span style="font-size:18px;font-weight:700;color:#ffffff;letter-spacing:0.5px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                      Ranok Raihan
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#ffffff;border-radius:16px;box-shadow:0 1px 4px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.04);overflow:hidden;">

              <!-- Top accent bar (red for security/urgency) -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(90deg,#dc2626 0%,#ef4444 100%);height:4px;font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>

              <!-- Card body -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:44px 48px 40px;">

                <!-- Icon -->
                <tr>
                  <td align="center" style="padding-bottom:24px;">
                    <div style="width:64px;height:64px;line-height:64px;text-align:center;font-size:28px;background-color:#fef2f2;border-radius:50%;">
                      &#128274;
                    </div>
                  </td>
                </tr>

                <!-- Heading -->
                <tr>
                  <td align="center" style="padding-bottom:12px;">
                    <h1 style="margin:0;font-size:24px;font-weight:700;color:#09090b;letter-spacing:-0.3px;line-height:1.3;">
                      Reset your password
                    </h1>
                  </td>
                </tr>

                <!-- Subtext -->
                <tr>
                  <td align="center" style="padding-bottom:36px;">
                    <p style="margin:0;font-size:15px;color:#71717a;line-height:1.65;max-width:400px;">
                      Hi <strong style="color:#09090b;">${name}</strong>, we received a request to reset the password for your <strong style="color:#09090b;">Ranok Raihan Portfolio Dashboard</strong> account.
                      Click the button below to choose a new password.
                    </p>
                  </td>
                </tr>

                <!-- CTA Button -->
                <tr>
                  <td align="center" style="padding-bottom:36px;">
                    <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
                      href="${resetUrl}" style="height:50px;width:220px;v-text-anchor:middle;" arcsize="16%"
                      fillcolor="#dc2626" stroke="f">
                      <w:anchorlock/>
                      <center style="color:#ffffff;font-family:sans-serif;font-size:15px;font-weight:700;">Reset Password</center>
                    </v:roundrect>
                    <![endif]-->
                    <!--[if !mso]><!-->
                    <a href="${resetUrl}"
                      style="display:inline-block;background-color:#dc2626;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:15px;font-weight:600;letter-spacing:0.2px;line-height:1;-webkit-text-size-adjust:none;">
                      Reset Password
                    </a>
                    <!--<![endif]-->
                  </td>
                </tr>

                <!-- Fallback link -->
                <tr>
                  <td style="border-top:1px solid #f4f4f5;padding-top:28px;padding-bottom:16px;">
                    <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.5px;">
                      Or copy this link
                    </p>
                    <p style="margin:0;font-size:12px;color:#71717a;word-break:break-all;line-height:1.6;background-color:#fafafa;border-radius:6px;padding:10px 12px;border:1px solid #f4f4f5;">
                      ${resetUrl}
                    </p>
                  </td>
                </tr>

                <!-- Expiry + security notice -->
                <tr>
                  <td style="padding-top:8px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background-color:#fff7ed;border-radius:8px;border-left:3px solid #f97316;padding:12px 16px;">
                          <p style="margin:0;font-size:13px;color:#78350f;line-height:1.5;">
                            <strong>This link expires in 15 minutes.</strong>
                            If you didn&rsquo;t request a password reset, you can safely ignore this email &mdash; your password will not change.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:28px;">
              <p style="margin:0 0 6px;font-size:12px;color:#a1a1aa;">
                &copy; ${new Date().getFullYear()} Ranok Raihan &mdash; Portfolio
              </p>
              <p style="margin:0;font-size:12px;color:#d4d4d8;">
                You received this email because a password reset was requested for your account.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
