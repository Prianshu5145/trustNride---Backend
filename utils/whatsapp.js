const { Client, MessageMedia, LocalAuth } = require('whatsapp-web.js');
const axios = require('axios');
const qrcode = require('qrcode-terminal'); // Import qrcode-terminal

// Initialize the client with Puppeteer launch options
const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "trustNrideClient",  // Optional: Assign a custom client ID
    dataPath: process.env.WEBJS_AUTH_PATH || './.wwebjs_auth', // Persist session path for deployments
  }),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'], // Add these arguments to Puppeteer for cloud environments
  },
});

let isClientReady = false;

// Event listener for QR code generation
client.on('qr', (qr) => {
  console.log('QR Code received. Please scan it using WhatsApp:');
  
  // QR code URL for scanning in browser (useful for cloud environments)
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qr)}&size=300x300`;
  console.log(`Scan the QR code by visiting this link: ${qrUrl}`);
  
  // Optionally, generate the QR code directly in the terminal for local environments
  qrcode.generate(qr, { small: true });
});

// Event listener when WhatsApp client is ready
client.on('ready', () => {
  isClientReady = true;
  console.log('WhatsApp client is ready!');
});

// Event listener for authentication
client.on('authenticated', () => {
  console.log('Authenticated! Session saved!');
});

// Event listener for disconnection
client.on('disconnected', () => {
  isClientReady = false;
  console.log('WhatsApp client disconnected. Reconnecting...');
  client.initialize();  // Reinitialize the client if disconnected
});

// Function to download media from Cloudinary or any URL and convert it to MessageMedia
const downloadAndCreateMedia = async (url) => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);

    // Create MessageMedia using buffer
    const media = new MessageMedia('application/pdf', buffer.toString('base64'), 'file.pdf');
    return media;
  } catch (error) {
    console.error('Error downloading media:', error);
    throw error;
  }
};

// Export sendMessage function
const sendMessage = async (phoneNumber, options) => {
  try {
    if (!isClientReady) {
      console.error('WhatsApp client is not ready yet.');
      return;
    }

    const number = phoneNumber + '@c.us';

    if (!options.text && !options.images && !options.files) {
      console.error('No content provided to send.');
      return;
    }

    // Send multiple text messages if available
    if (options.text && Array.isArray(options.text)) {
      for (const text of options.text) {
        await client.sendMessage(number, text);
      }
    }

    // Send single text message if it's not an array
    if (options.text && !Array.isArray(options.text)) {
      await client.sendMessage(number, options.text);
    }

    // Send images
    if (options.images && Array.isArray(options.images)) {
      for (const imagePath of options.images) {
        let media;
        if (typeof imagePath === 'string' && imagePath.startsWith('http')) {
          media = await downloadAndCreateMedia(imagePath); // Download and create media for URL
        } else if (typeof imagePath === 'string') {
          media = MessageMedia.fromFilePath(imagePath); // Local file
        } else {
          console.error('Invalid image path:', imagePath);
          continue;
        }
        await client.sendMessage(number, media);
      }
    }

    // Send files with filenames
    if (options.files && Array.isArray(options.files)) {
      for (const file of options.files) {
        const filePath = file.filePath; // Extract filePath from the object
        const fileName = file.filename || 'file.pdf'; // Default to 'file.pdf' if no filename is provided
        let media;

        if (typeof filePath === 'string' && filePath.startsWith('http')) {
          media = await downloadAndCreateMedia(filePath); // Download and create media for URL
        } else if (typeof filePath === 'string') {
          media = MessageMedia.fromFilePath(filePath); // Local file
        } else {
          console.error('Invalid file path:', filePath);
          continue;
        }
        // Send file with the specified filename
        await client.sendMessage(number, media, { filename: fileName });
      }
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

// Initialize the client
client.initialize();

// Export sendMessage function for external use
module.exports = { sendMessage };
