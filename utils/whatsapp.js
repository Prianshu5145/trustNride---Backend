const { Client, MessageMedia, LocalAuth } = require('whatsapp-web.js');
const axios = require('axios');
const qrcode = require('qrcode-terminal');

// Custom log function to flush logs explicitly
const logMessage = (message) => {
  console.log(message);
  process.stdout.write(message + '\n');
};

logMessage('Starting Application...');

// Initialize the client with Puppeteer options
let clientInitialized = false; // Ensure initialization happens only once
const client = new Client({
  authStrategy: new LocalAuth({
    clientId: 'trustNrideClient',
    dataPath: process.env.WEBJS_AUTH_PATH || './.wwebjs_auth',
  }),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
});

// Event listener for QR code generation
client.on('qr', (qr) => {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qr)}&size=300x300`;
  logMessage(`QR Code received. Scan using this link: ${qrUrl}`);
  qrcode.generate(qr, { small: true });
});

// Event listener when WhatsApp client is ready
client.on('ready', () => {
  logMessage('WhatsApp client is ready!');
});

// Event listener for authentication
client.on('authenticated', () => {
  logMessage('Authenticated! Session saved!');
});

// Event listener for disconnection
client.on('disconnected', (reason) => {
  logMessage(`WhatsApp client disconnected. Reason: ${reason}`);
  logMessage('Reinitializing the client...');
  client.initialize();
});

// Ensure client is initialized only once
if (!clientInitialized) {
  client.initialize();
  clientInitialized = true;
  logMessage('WhatsApp Client Initialization Triggered...');
}

// Function to send messages
const sendMessage = async (phoneNumber, options) => {
  try {
    const number = `${phoneNumber}@c.us`;

    if (!options.text && !options.images && !options.files) {
      throw new Error('No content provided to send.');
    }

    // Sending text messages
    if (options.text) {
      await client.sendMessage(number, options.text);
      logMessage(`Text message sent to ${phoneNumber}: ${options.text}`);
    }

    // Sending files
    if (options.files) {
      for (const file of options.files) {
        const media = MessageMedia.fromFilePath(file.filePath);
        await client.sendMessage(number, media, { filename: file.filename });
        logMessage(`File sent to ${phoneNumber}: ${file.filename}`);
      }
    }

    logMessage(`Message(s) successfully sent to ${phoneNumber}`);
    return { success: true, message: 'Message(s) sent successfully.' };
  } catch (error) {
    logMessage(`Error sending message to ${phoneNumber}: ${error.message}`);
    return { success: false, message: error.message };
  }
};

module.exports = { sendMessage };

// Suppress MongoDB deprecation warnings
process.on('warning', (warning) => {
  if (warning.name === 'MONGODB DRIVER') {
    logMessage(`MongoDB Warning: ${warning.message}`);
  }
});
