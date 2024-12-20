const { Client, MessageMedia, LocalAuth } = require('whatsapp-web.js');
const axios = require('axios');
const qrcode = require('qrcode-terminal');

// Custom log function to ensure logs are flushed
const logMessage = (message) => {
  console.log(message);
  process.stdout.write(message + '\n'); // Explicitly flush output
};

// Initialize the client with Puppeteer launch options
logMessage('Initializing WhatsApp Client...');
const client = new Client({
  authStrategy: new LocalAuth({
    clientId: 'trustNrideClient', // Custom client ID
    dataPath: process.env.WEBJS_AUTH_PATH || './.wwebjs_auth', // Session path for deployments
  }),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'], // Puppeteer args for cloud environments
  },
});

let isClientReady = false;

// Event listener for QR code generation
client.on('qr', (qr) => {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qr)}&size=300x300`;
  logMessage(`QR Code received. Scan using this link: ${qrUrl}`);
  qrcode.generate(qr, { small: true }); // Generate QR code in terminal
});

// Event listener when WhatsApp client is ready
client.on('ready', () => {
  isClientReady = true;
  logMessage('WhatsApp client is ready!');
});

// Event listener for authentication
client.on('authenticated', () => {
  logMessage('Authenticated! Session saved!');
});

// Event listener for disconnection
client.on('disconnected', (reason) => {
  isClientReady = false;
  logMessage(`WhatsApp client disconnected. Reason: ${reason}`);
  logMessage('Reinitializing the client...');
  client.initialize();
});

// Function to download media from a URL and convert it to MessageMedia
const downloadAndCreateMedia = async (url) => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);
    const media = new MessageMedia('application/pdf', buffer.toString('base64'), 'file.pdf');
    return media;
  } catch (error) {
    logMessage(`Error downloading media: ${error.message}`);
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
        logMessage(`Text message sent to ${phoneNumber}: ${text}`);
      }
    } else if (options.text) {
      await client.sendMessage(number, options.text);
      logMessage(`Text message sent to ${phoneNumber}: ${options.text}`);
    }

    // Send images
    if (options.images && Array.isArray(options.images)) {
      for (const imagePath of options.images) {
        const media = imagePath.startsWith('http')
          ? await downloadAndCreateMedia(imagePath)
          : MessageMedia.fromFilePath(imagePath);
        await client.sendMessage(number, media);
        logMessage(`Image sent to ${phoneNumber}: ${imagePath}`);
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
        logMessage(`File sent to ${phoneNumber}: ${fileName}`);
      }
    }

    logMessage(`Message(s) successfully sent to ${phoneNumber}`);
    return { success: true, message: 'Message(s) sent successfully.' };
  } catch (error) {
    logMessage(`Error sending message to ${phoneNumber}: ${error.message}`);
    return { success: false, message: error.message };
  }
};

// Add a health check route for debugging readiness status
const healthCheck = (req, res) => {
  res.json({ isClientReady });
};

// Initialize the client
client.initialize();

module.exports = { sendMessage, healthCheck };
