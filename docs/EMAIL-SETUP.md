# Email setup (application notifications)

When a user applies to a vacancy, the backend sends an email to the company.  
If you see:

```text
Error: connect ECONNREFUSED 127.0.0.1:465
```

then the app is trying to use an SMTP server on **localhost:465**, but no mail server is running there.

## What the code does now

- The **application is still saved** (CV in S3, record in DB). The request returns **201**.
- Sending the notification email is best-effort: if it fails, a warning is logged and the response is still success.

## To enable email

Set these in your `.env` (see `.env.example`):

| Variable     | Example            | Description                    |
|-------------|--------------------|--------------------------------|
| `EMAIL_HOST`| `smtp.gmail.com`   | SMTP server host               |
| `EMAIL_USER`| your email         | SMTP login                     |
| `EMAIL_PASS`| app password       | SMTP password (e.g. Gmail app password) |
| `EMAIL_FROM`| (optional)         | From address in emails         |

**Gmail:** use an [App Password](https://support.google.com/accounts/answer/185833), not your normal password.  
**Other providers:** use their SMTP host (e.g. SendGrid, Mailtrap, Outlook).

Port **465** (SMTPS) with `secure: true` is used. If your provider uses port 587 (STARTTLS), set `EMAIL_PORT=587` and in `email-sender.module.ts` use `secure: false` for that port.

**If mail still doesn’t send:**
- **Gmail:** Use an [App Password](https://support.google.com/accounts/answer/185833) (2FA must be on). The normal account password will not work.
- Check backend logs: on success you’ll see `Application notification email sent to ...`; on failure, a warning with the error (e.g. invalid credentials, connection refused).
- Check the recipient’s spam folder.
- Ensure `EMAIL_FROM` matches your account or your provider’s allowed sender (e.g. for Gmail, use your Gmail address).
