const axios = require('axios');
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
              const recipients = ['+918400943441', '+919792983625', '+919628674776']; // Replace these with actual phone numbers

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
    }
}

module.exports = { uploadMediaAndSendMessage };