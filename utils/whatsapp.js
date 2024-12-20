const { Client, MessageMedia, LocalAuth } = require('whatsapp-web.js');
const axios = require('axios');
const qrcode = require('qrcode-terminal'); // Import qrcode-terminal

const client = new Client({
  authStrategy: new LocalAuth(),
});

let isClientReady = false;

client.on('qr', (qr) => {
  console.log('QR Code received. Please scan it using WhatsApp:');
  qrcode.generate(qr, { small: true }); // Generate and display the QR code
});

client.on('ready', () => {
  isClientReady = true;
  console.log('WhatsApp client is ready!');
});

client.on('authenticated', () => {
  console.log('Authenticated! Session saved!');
});

client.on('disconnected', () => {
  isClientReady = false;
  console.log('WhatsApp client disconnected. Reconnecting...');
  client.initialize();
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

client.initialize();

module.exports = { sendMessage };
