const axios = require('axios');
<<<<<<< HEAD
const FormData = require('form-data');
require('dotenv').config();
/**
 * Upload media and send a message to a WhatsApp recipient.
 * @param {string} phoneNumberId - The phone number ID.
 * @param {string} messagingProduct - The messaging product (e.g., "whatsapp").
 * @param {File} file - The file object.
 * @param {string} token - The direct bearer token for authentication.
 * @param {string} recipientPhoneNumber - The recipient's phone number.
 * @param {string} documentCaption - The caption for the document.
 * @param {string} documentFilename - The filename of the document.
 * @returns {Promise<Object>} - The combined API response data for upload and message.
 */
async function uploadMediaAndSendMessage(phoneNumberId, messagingProduct,CustomerMessage1,CustomerMessage2,ownerMessage, file,recipientPhoneNumber) {
    try {

        const token = process.env.token1;
    //send meassage customer -message1
    const messages = [CustomerMessage1, CustomerMessage2]; // Array of messages to send
const responses = [];

for (let i = 0; i < messages.length; i++) {
    const body = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: `+91${recipientPhoneNumber}`,
        type: "text",
        text: {
            preview_url: "false",
            body: messages[i], // Using messages[i] to send the respective message
        },
    };

    try {
        const response = await axios.post(
            `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
            body,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log('message',response.data);
        
    } catch (error) {
        console.error(`Error sending message ${i + 1}:`, error);
    }
}
=======
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
>>>>>>> 9ef226ee3eb575facd8dafdeca3f5b179b2469a9

 

<<<<<<< HEAD
        // Upload Media to get id for customer
        const form = new FormData();
        form.append('messaging_product', messagingProduct);
        form.append('file', file);
          
        const uploadResponseforid = await axios.post(
            `https://graph.facebook.com/v21.0/${phoneNumberId}/media`,
            form,
            {
                headers: {
                    ...form.getHeaders(),
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        
        const documentId = uploadResponseforid.data.id;

        // Send media to customer
        const body = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: `+91${recipientPhoneNumber}`,
            type: "document",
            document: {
                id: documentId,
                caption: "",
                filename: "Token_Invoice And T&C",
            },
        };

        const uploadmediawithid = await axios.post(
            `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
            body,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
              //owners message and media-to all owner
              const recipients = ['+919119913441', '+919119913441', '+919119913441']; // Replace these with actual phone numbers

              for (let i = 0; i < recipients.length; i++) {
                  const body3 = {
                      messaging_product: "whatsapp",
                      recipient_type: "individual",
                      to: recipients[i], // Changing the recipient each time
                      type: "text",
                      text: {
                          preview_url: "false",
                          body: ownerMessage // The message you want to send
                      }
                  };
                  const body4 = {
                    messaging_product: "whatsapp",
                    recipient_type: "individual",
                    to: recipients[i],
                    type: "document",
                    document: {
                        id: documentId,
                        caption: "",
                        filename: "Token_Invoice And T&C",
                    },
                };
                  try {
                      const messageownerResponse = await axios.post(
                          `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
                          body3,
                          {
                              headers: {
                                  Authorization: `Bearer ${token}`,
                                  'Content-Type': 'application/json',
                              },
                          }
                      );
                      
                      console.log('messageownerResponse',messageownerResponse.data);
                      



                      const uploadmediawithid1 = await axios.post(
                        `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
                        body4,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            },
                        }
                    );
                    console.log('uploadmediawithid1',uploadmediawithid1.data);


                  } catch (error) {
                      console.error(`Error sending message to ${recipients[i]}:`, error);
                  }
              }
              





        return {
            uploadResponseforidResult: uploadResponseforid.data,
            uploadmediawithid: uploadmediawithid.data,
           reponsedata: responses.data
           
        };
    } catch (error) {
        console.error('Error in uploadMediaAndSendMessage:', error);
        throw error.response?.data || error;
=======
    if (!options.text && !options.images && !options.files) {
      throw new Error('No content provided to send.');
>>>>>>> 9ef226ee3eb575facd8dafdeca3f5b179b2469a9
    }
}

<<<<<<< HEAD
module.exports = { uploadMediaAndSendMessage };
=======
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
>>>>>>> 9ef226ee3eb575facd8dafdeca3f5b179b2469a9
