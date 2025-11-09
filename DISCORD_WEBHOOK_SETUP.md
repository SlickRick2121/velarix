# Discord Webhook Notifications Setup

This guide explains how to set up Discord webhook notifications for user account creations and other events.

## Features

- ✅ Notifications for new user account creations
- ✅ Notifications for user logins
- ✅ Support for multiple Discord servers (multiple webhooks)
- ✅ Rich embed messages with user information
- ✅ Custom notification support

## Setup Instructions

### 1. Create Discord Webhook(s)

1. Open your Discord server
2. Go to **Server Settings** → **Integrations** → **Webhooks**
3. Click **New Webhook**
4. Give it a name (e.g., "Velarix Notifications")
5. Choose a channel where notifications should be sent
6. Click **Copy Webhook URL**
7. Repeat for additional servers if needed

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your webhook URL(s) to `.env`:
   ```env
   # Single webhook
   VITE_DISCORD_WEBHOOK_URLS=https://discord.com/api/webhooks/123456789/abcdefgh
   
   # Multiple webhooks (comma-separated)
   VITE_DISCORD_WEBHOOK_URLS=https://discord.com/api/webhooks/123456789/abcdefgh,https://discord.com/api/webhooks/987654321/xyz123
   ```

### 3. For Production (Netlify/Vercel/etc.)

Add the environment variable in your hosting platform:

**Netlify:**
1. Go to Site Settings → Environment Variables
2. Add `VITE_DISCORD_WEBHOOK_URLS` with your webhook URL(s)
3. Redeploy your site

**Vercel:**
1. Go to Project Settings → Environment Variables
2. Add `VITE_DISCORD_WEBHOOK_URLS` with your webhook URL(s)
3. Redeploy your site

## What Gets Notified?

### New User Account Creation
- Triggered when a user signs up for the first time
- Includes:
  - User ID
  - Email (if available)
  - Phone Number (if available)
  - Display Name (if available)
  - Authentication Method (Google/Phone)
  - Timestamp

### User Login
- Triggered when an existing user logs in
- Includes:
  - User ID
  - Email (if available)
  - Display Name (if available)
  - Authentication Method
  - Timestamp

## Usage in Code

### Send Custom Notifications

```typescript
import { notifyCustom } from '@/lib/discord';

// Send a custom notification
await notifyCustom(
  'Custom Title',
  'This is a custom notification message',
  {
    color: 0xFF0000, // Red color
    fields: [
      {
        name: 'Field Name',
        value: 'Field Value',
        inline: true,
      },
    ],
    footer: 'Custom Footer',
  }
);
```

### Send User Creation Notification Manually

```typescript
import { notifyUserCreated } from '@/lib/discord';

await notifyUserCreated({
  uid: 'user123',
  email: 'user@example.com',
  displayName: 'John Doe',
  providerId: 'google.com',
});
```

## Color Codes

Discord embed colors (hexadecimal):
- **Green (Success)**: `0x57F287` - Used for new user creation
- **Blurple (Info)**: `0x5865F2` - Used for logins
- **Red (Error)**: `0xED4245` - Use for errors
- **Yellow (Warning)**: `0xFEE75C` - Use for warnings
- **Orange**: `0xEB459E` - Custom use

## Troubleshooting

### Notifications Not Sending

1. **Check webhook URL**: Make sure the URL is correct and not expired
2. **Check environment variable**: Verify `VITE_DISCORD_WEBHOOK_URLS` is set correctly
3. **Check browser console**: Look for error messages
4. **Test webhook**: Use a tool like [Discord Webhook Tester](https://discord.com/api/webhooks/) to verify your webhook works

### Multiple Webhooks Not Working

- Ensure webhooks are comma-separated with no spaces (or spaces are trimmed)
- Each webhook URL should be a complete, valid Discord webhook URL

### Security Note

⚠️ **Important**: Never commit your `.env` file or webhook URLs to version control. Webhook URLs are sensitive and should be kept secret.

## Example Notification

When a new user signs up, you'll receive a Discord message like this:

```
🎉 New User Account Created
A new user has successfully created an account on your platform.

User ID: abc123...
Email: user@example.com
Display Name: John Doe
Auth Method: google.com
Account Created: [timestamp]
```

