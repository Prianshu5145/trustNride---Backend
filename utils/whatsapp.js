const { Client, MessageMedia, LocalAuth } = require('whatsapp-web.js');
const axios = require('axios');
const qrcode = require('qrcode-terminal');
const express = require('express');

// Initialize Express app for health checks
const app = express();
const PORT = 3000;

// Initialize the WhatsApp client with Puppeteer options
const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: './wwebjs_auth_persistent', // Persistent session path
  }),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'], // Puppeteer args for deployment
  },
});

let isClientReady = false;
let clientReadyPromise = new Promise((resolve, reject) => {
  client.on('ready', () => {
    isClientReady = true;
    console.log('WhatsApp client is ready!');
    resolve();
  });

  client.on('auth_failure', (message) => {
    console.error('Authentication failure:', message);
    isClientReady = false;
    reject(new Error('Authentication failed'));
  });

  client.on('disconnected', (reason) => {
    console.error('Client disconnected:', reason);
    isClientReady = false;
    client.initialize();
  });
});

// Helper function to wait for the client to be ready
const waitForClientReady = async () => {
  if (!isClientReady) {
    console.log('Waiting for WhatsApp client to become ready...');
    await clientReadyPromise;
  }
};

// Event listener for QR code generation
client.on('qr', (qr) => {
  console.log('QR Code received. Please scan it using WhatsApp:');
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qr)}&size=300x300`;
  console.log(`Scan the QR code by visiting this link: ${qrUrl}`);
  qrcode.generate(qr, { small: true }); // Terminal QR code generation
});

// Event listener for authenticated event
client.on('authenticated', () => {
  console.log('Authenticated! Session saved!');
});

// Event listener for loading screen
client.on('loading_screen', (percent, message) => {
  console.log(`LOADING: ${percent}% - ${message}`);
});

// Function to download media from a URL and convert it to MessageMedia
const downloadAndCreateMedia = async (url) => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);
    const media = new MessageMedia('application/pdf', buffer.toString('base64'), 'file.pdf');
    return media;
  } catch (error) {
    console.error('Error downloading media:', error.message);
    throw error;
  }
};

// Export sendMessage function
const sendMessage = async (phoneNumber, options) => {
  try {
    await waitForClientReady();

    const number = phoneNumber + '@c.us';

    if (!options.text && !options.images && !options.files) {
      throw new Error('No content provided to send.');
    }

    // Send text messages
    if (options.text && Array.isArray(options.text)) {
      for (const text of options.text) {
        await client.sendMessage(number, text);
        console.log(`Text message sent to ${phoneNumber}: ${text}`);
      }
    } else if (options.text) {
      await client.sendMessage(number, options.text);
      console.log(`Text message sent to ${phoneNumber}: ${options.text}`);
    }

    // Send images
    if (options.images && Array.isArray(options.images)) {
      for (const imagePath of options.images) {
        const media = imagePath.startsWith('http')
          ? await downloadAndCreateMedia(imagePath)
          : MessageMedia.fromFilePath(imagePath);
        await client.sendMessage(number, media);
        console.log(`Image sent to ${phoneNumber}: ${imagePath}`);
      }
    }

    // Send files with filenames
    if (options.files && Array.isArray(options.files)) {
      for (const file of options.files) {
        const filePath = file.filePath;
        const fileName = file.filename || 'file.pdf';
        const media = filePath.startsWith('http')
          ? await downloadAndCreateMedia(filePath)
          : MessageMedia.fromFilePath(filePath);
        await client.sendMessage(number, media, { filename: fileName });
        console.log(`File sent to ${phoneNumber}: ${fileName}`);
      }
    }

    console.log(`Message(s) successfully sent to ${phoneNumber}`);
    return { success: true, message: 'Message(s) sent successfully.' };
  } catch (error) {
    console.error(`Error sending message to ${phoneNumber}:`, error.message);
    return { success: false, message: error.message };
  }
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ isClientReady });
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Health check server running on port ${PORT}`);
});

// Initialize the WhatsApp client
client.initialize();

module.exports = { sendMessage };
