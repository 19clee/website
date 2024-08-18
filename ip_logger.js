const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Path to the log file
const logFilePath = path.join(__dirname, 'ip_logs.log');

// Define your Discord webhook URL
const discordWebhookUrl = 'YOUR_DISCORD_WEBHOOK_URL';

module.exports = async (req, res) => {
    try {
        if (req.method === 'POST') {
            // Extract IP address and other data from request
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            const data = req.body;
            
            // Create log entry
            const logEntry = `${new Date().toISOString()} - IP: ${ip} - Data: ${JSON.stringify(data)}\n`;

            // Append to log file
            fs.appendFile(logFilePath, logEntry, (err) => {
                if (err) {
                    console.error('Failed to write to log file:', err);
                    res.status(500).send('Internal Server Error');
                    return;
                }
            });

            // Send data to Discord
            await axios.post(discordWebhookUrl, {
                content: `New log entry: ${logEntry}`
            });

            res.status(200).send('Data logged and forwarded to Discord');
        } else {
            res.status(405).send('Method Not Allowed');
        }
    } catch (error) {
        console.error('Unexpected error occurred:', error);
        res.status(500).send('Internal Server Error');
    }
};
