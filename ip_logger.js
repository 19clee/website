const axios = require('axios');
const fs = require('fs');
const path = require('path');

const webhookSiteUrl = 'https://webhook.site/f941bb91-f1e2-4d38-87f2-846d75759558';
const discordWebhookUrl = 'https://discord.com/api/webhooks/1274652381203660923/r88yriOiZcv6kzvBksSNGF4UnCtn8LSJPfx5wQZDgr0YiBpMOg7fzMEMpGLyKiLcEpKd'; // Replace with your Discord webhook URL

// Path to the log file
const logFilePath = path.join(__dirname, 'ip_logs.log');

const fetchWebhookData = async () => {
    try {
        // Fetch data from Webhook.site
        const response = await axios.get(webhookSiteUrl);

        const requests = response.data;
        
        // Process each request
        requests.forEach(async (request) => {
            const ip = request.body.ip || 'Unknown IP';
            const logEntry = `${new Date().toISOString()} - IP: ${ip}\n`;

            // Append to log file
            fs.appendFile(logFilePath, logEntry, (err) => {
                if (err) {
                    console.error('Failed to write to log file:', err);
                    return;
                }
            });

            // Send data to Discord
            await axios.post(discordWebhookUrl, {
                content: `New log entry: ${logEntry}`
            });
        });

    } catch (error) {
        console.error('Error fetching or sending data:', error);
    }
};

// Fetch and forward data every minute
setInterval(fetchWebhookData, 5000);
