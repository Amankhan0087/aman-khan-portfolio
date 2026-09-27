# Deploying to Hostinger

## 1. Upload files to `public_html/`

Upload these via Hostinger File Manager (or FTP):

```
public_html/
├── index.html
├── styles.css
├── main.js
├── submit.php
├── assets/
│   └── aman.jpg
└── data/
    └── .htaccess          (blocks public access — already included)
```

> Hostinger's File Manager will auto-create `public_html/`. Just drag the files in.

## 2. Configure `submit.php`

Open `submit.php` in the file editor and change three values at the top:

```php
$TO_EMAIL    = 'amankhan46473@gmail.com';     // already set
$FROM_EMAIL  = 'noreply@yourdomain.com';      // ← change after buying domain
$ADMIN_TOKEN = 'CHANGE_ME_TO_A_LONG_RANDOM_STRING';  // ← a 32+ char random string
```

Generate a token: open https://www.random.org/strings/ and pick 32 alphanumeric chars.

## 3. Permissions for the `data/` folder

In File Manager → right-click `data/` → Permissions → set to **755**.
PHP needs to be able to write `messages.json` and `messages.csv` inside it.

## 4. Domain

In Hostinger hPanel:
- Domains → Domain Portfolio → buy your chosen domain (e.g. `amankhan.dev`)
- Auto-points to your hosting if bought on the same account
- Security → SSL → enable free Let's Encrypt (takes ~5 min)

## 5. Test it

Visit `https://yourdomain.com` → submit the contact form → check your inbox.

## 6. View saved messages

To see all submissions saved to disk, visit:

```
https://yourdomain.com/submit.php?inbox=1&token=YOUR_ADMIN_TOKEN
```

Returns JSON of every message ever submitted (newest first).

You can also download `data/messages.csv` from File Manager and open in Excel.

## Anti-spam features built in
- **Honeypot field** — silently rejects bots that fill the hidden `website` input
- **Rate limit** — max 5 submissions per IP per hour
- **Field validation** — server-side length + email format checks
- **Storage protection** — `data/` folder is blocked from public HTTP access via `.htaccess`

## Optional upgrade: real SMTP email

`mail()` uses Hostinger's PHP mailer which sometimes lands in spam. For better deliverability:
1. Create an email account in hPanel: `noreply@yourdomain.com`
2. Install PHPMailer (or composer) and update `submit.php` to use SMTP
3. Use the email account credentials in the SMTP config

Tell me when you've bought the domain and I'll wire up SMTP for you.
