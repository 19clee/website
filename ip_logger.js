const axios = require('axios');
const fs = require('fs');
const path = require('path');

const webhookSiteUrl = 'https://webhook.site/afd94cb4-dbc2-49e0-acee-ed69ea06b26c';
const discordWebhookUrl = 'https://discord.com/api/webhooks/1274652381203660923/r88yriOiZcv6kzvBksSNGF4UnCtn8LSJPfx5wQZDgr0YiBpMOg7fzMEMpGLyKiLcEpKd';

// Path to the log file
const logFilePath = path.join(__dirname, 'ip_logs.log');

const fetchWebhookData = async () => {
    try {
        // Fetch data from Webhook.site
        const response = await axios.get(webhookSiteUrl);

        // Extract data
        const requests = response.data.requests; // Assuming Webhook.site data has a `requests` field

        if (requests && requests.length > 0) {
            // Process each request
            for (const request of requests) {
                const ip = request.body && request.body.ip ? request.body.ip : 'Unknown IP';
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
            }
        } else {
            console.log('No new data found.');
        }

    } catch (error) {
        console.error('Error fetching or sending data:', error);
    }
};

// Fetch and forward data every 5 seconds (5000 milliseconds)
setInterval(fetchWebhookData, 5000);

// Optionally, run once immediately
fetchWebhookData();
