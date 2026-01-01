const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_EARLY_ACCESS_CHANNEL_ID = process.env.DISCORD_EARLY_ACCESS_CHANNEL_ID;

export async function createExclusiveInvite(): Promise<string> {
  if (!DISCORD_BOT_TOKEN || !DISCORD_EARLY_ACCESS_CHANNEL_ID) {
    throw new Error('Discord bot token or channel ID not configured');
  }

  const response = await fetch(
    `https://discord.com/api/v10/channels/${DISCORD_EARLY_ACCESS_CHANNEL_ID}/invites`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        max_uses: 1,    // Single use only
        max_age: 0,     // Never expires
        unique: true,   // Always generate new code
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Discord API error:', errorData);
    throw new Error(`Failed to create Discord invite: ${response.status} ${response.statusText}`);
  }

  const invite = await response.json();
  console.log('Discord invite created:', invite.code);
  return `https://discord.gg/${invite.code}`;
}
