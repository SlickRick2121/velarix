/**
 * Discord Webhook Notification Utility
 * Sends notifications to one or multiple Discord servers via webhooks
 */

export interface DiscordWebhookMessage {
  content?: string;
  username?: string;
  avatar_url?: string;
  embeds?: DiscordEmbed[];
}

export interface DiscordEmbed {
  title?: string;
  description?: string;
  color?: number;
  fields?: DiscordEmbedField[];
  footer?: {
    text: string;
    icon_url?: string;
  };
  timestamp?: string;
  thumbnail?: {
    url: string;
  };
}

export interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface NotificationOptions {
  title: string;
  description: string;
  color?: number;
  fields?: DiscordEmbedField[];
  footer?: string;
}

/**
 * Get Discord webhook URLs from environment variables
 * Supports multiple webhooks separated by commas
 */
function getWebhookUrls(): string[] {
  const webhookEnv = import.meta.env.VITE_DISCORD_WEBHOOK_URLS || '';
  
  if (!webhookEnv) {
    console.warn('No Discord webhook URLs configured. Set VITE_DISCORD_WEBHOOK_URLS environment variable.');
    return [];
  }

  // Split by comma and trim whitespace
  return webhookEnv
    .split(',')
    .map(url => url.trim())
    .filter(url => url.length > 0);
}

/**
 * Send a message to Discord webhook(s)
 */
async function sendToWebhook(webhookUrl: string, message: DiscordWebhookMessage): Promise<boolean> {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Discord webhook error (${response.status}):`, errorText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to send Discord webhook:', error);
    return false;
  }
}

/**
 * Send notification to all configured Discord webhooks
 */
export async function sendDiscordNotification(options: NotificationOptions): Promise<void> {
  const webhookUrls = getWebhookUrls();

  if (webhookUrls.length === 0) {
    console.warn('No Discord webhooks configured. Skipping notification.');
    return;
  }

  const embed: DiscordEmbed = {
    title: options.title,
    description: options.description,
    color: options.color || 0x5865F2, // Discord blurple default
    fields: options.fields,
    timestamp: new Date().toISOString(),
    footer: options.footer ? {
      text: options.footer,
    } : undefined,
  };

  const message: DiscordWebhookMessage = {
    embeds: [embed],
  };

  // Send to all webhooks in parallel
  const promises = webhookUrls.map(url => sendToWebhook(url, message));
  await Promise.allSettled(promises);
}

/**
 * Send a user account creation notification
 */
export async function notifyUserCreated(user: {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  phoneNumber?: string | null;
  providerId?: string;
}): Promise<void> {
  const fields: DiscordEmbedField[] = [
    {
      name: 'User ID',
      value: `\`${user.uid}\``,
      inline: true,
    },
  ];

  if (user.email) {
    fields.push({
      name: 'Email',
      value: user.email,
      inline: true,
    });
  }

  if (user.phoneNumber) {
    fields.push({
      name: 'Phone',
      value: user.phoneNumber,
      inline: true,
    });
  }

  if (user.displayName) {
    fields.push({
      name: 'Display Name',
      value: user.displayName,
      inline: true,
    });
  }

  if (user.providerId) {
    fields.push({
      name: 'Auth Method',
      value: user.providerId,
      inline: true,
    });
  }

  fields.push({
    name: 'Account Created',
    value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    inline: false,
  });

  await sendDiscordNotification({
    title: '🎉 New User Account Created',
    description: 'A new user has successfully created an account on your platform.',
    color: 0x57F287, // Discord green
    fields,
    footer: 'Velarix Platform',
  });
}

/**
 * Send a user login notification
 */
export async function notifyUserLogin(user: {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  providerId?: string;
}): Promise<void> {
  const fields: DiscordEmbedField[] = [
    {
      name: 'User ID',
      value: `\`${user.uid}\``,
      inline: true,
    },
  ];

  if (user.email) {
    fields.push({
      name: 'Email',
      value: user.email,
      inline: true,
    });
  }

  if (user.displayName) {
    fields.push({
      name: 'Display Name',
      value: user.displayName,
      inline: true,
    });
  }

  if (user.providerId) {
    fields.push({
      name: 'Auth Method',
      value: user.providerId,
      inline: true,
    });
  }

  await sendDiscordNotification({
    title: '🔐 User Login',
    description: 'A user has logged into the platform.',
    color: 0x5865F2, // Discord blurple
    fields,
    footer: 'Velarix Platform',
  });
}

/**
 * Send a custom notification
 */
export async function notifyCustom(
  title: string,
  description: string,
  options?: {
    color?: number;
    fields?: DiscordEmbedField[];
    footer?: string;
  }
): Promise<void> {
  await sendDiscordNotification({
    title,
    description,
    color: options?.color,
    fields: options?.fields,
    footer: options?.footer,
  });
}

