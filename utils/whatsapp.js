const { Client, MessageMedia, LocalAuth } = require('whatsapp-web.js');
const axios = require('axios');
const qrcode = require('qrcode-terminal');

console.log('Initializing WhatsApp Client...');

// Initialize the client with Puppeteer launch options
const client = new Client({
  authStrategy: new LocalAuth({
    clientId: 'trustNrideClient',
    dataPath: process.env.WEBJS_AUTH_PATH || './.wwebjs_auth',
  }),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
});

let isClientReady = false;

// Event listener for QR code generation
client.on('qr', (qr) => {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qr)}&size=300x300`;
  console.log(`QR Code received. Scan using this link: ${qrUrl}`);
  qrcode.generate(qr, { small: true });
});

// Event listener for authentication
client.on('authenticated', () => {
  console.log('Authenticated! Session saved!');
  process.stdout.write('Authenticated! Session saved!\n');
});

// Event listener when WhatsApp client is ready
client.on('ready', () => {
  isClientReady = true;
  console.log('WhatsApp client is ready!');
  process.stdout.write('WhatsApp client is ready!\n');
});

// Event listener for authentication failure
client.on('auth_failure', (msg) => {
  console.error('Authentication failed:', msg);
  process.stdout.write(`Authentication failed: ${msg}\n`);
});

// Event listener for disconnection
client.on('disconnected', (reason) => {
  isClientReady = false;
  console.error(`WhatsApp client disconnected. Reason: ${reason}`);
  process.stdout.write(`WhatsApp client disconnected. Reason: ${reason}\n`);
  console.log('Reinitializing the client...');
  client.initialize();
});

// Error handler for unexpected crashes
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.stdout.write(`Unhandled Rejection at: ${reason}\n`);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.stdout.write(`Uncaught Exception: ${error.message}\n`);
});

// Add a health check route for debugging readiness status
const healthCheck = (req, res) => {
  res.json({ isClientReady });
};

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
    if (!isClientReady) {
      throw new Error('WhatsApp client is not ready.');
    }

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

// Initialize the client
client.initialize();

module.exports = { sendMessage, healthCheck };
