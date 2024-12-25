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
async function uploadMediaAndSendMessage(phoneNumberId, messagingProduct,file,recipientPhoneNumber,carTitle,
    carModel,
    customerName,
    customerMobile,
    customerAddress,
    customerEmail,
    tokenAmount,
    dateOfPaymentReceived,
    paymentMode,
    paymentTo,
    dealDoneAmount,
    fairMarketValue,
    carRegistrationNumber,
    loanOrCash) {
    try {

        const token = process.env.token1;
    //send meassage customer -message1
    const bodytemplatemessage1customer = {
        
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: `+91${recipientPhoneNumber}`,
        type: "template",
        template: {
            name: "congransmessageoncarpurchase",
            language: {
                code: "en_US"
            },
            components: [
                
            ]
        
    }
};

try {
    const response = await axios.post(
        `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
        bodytemplatemessage1customer,
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


const bodytemplatemessage2customer  =    {
        messaging_product: "whatsapp",
        to: `+91${recipientPhoneNumber}`,
        type: "template",
        template: {
          name: "tokendetailsforcustomer",
          language: {
            code: "en_US"
          },
          components: [
            {
              type: "header",
              parameters: [
                {
                  type: "document",
                  document: {
                   id: documentId,
              caption: "",
              filename: "Token_Invoice"
                  }
                }
              ]
            },
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  text: carTitle
                },
                {
                  type: "text",
                  text: carModel
                },
                {
                  type: "text",
                  text: dealDoneAmount
                },
                {
                  type: "text",
                  text: tokenAmount
                },
                {
                  type: "text",
                  text: fairMarketValue
                }
              ]
            }
          ]
        }
      }
      
      try {
        const response = await axios.post(
            `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
            bodytemplatemessage2customer,
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
     

    



        
        
              //owners message and media-to all owner
              const recipients = ['+918400943441', '+919792983625', '+919628674776']; // Replace these with actual phone numbers

              for (let i = 0; i < recipients.length; i++) {
                  const bodymessageownertemplate = {
                    messaging_product: "whatsapp",
                    to: recipients[i],
                    type: "template",
                    template: {
                      name: "teamtokenmessage",
                      language: {
                        code: "en"
                      },
                      components: [
                        {
                          type: "header",
                          parameters: [
                            {
                              type: "document",
                              document: {
                               id: documentId,
                          caption: "",
                          filename: "Token_Invoice"
                              }
                            }
                          ]
                        },
                        {
                          type: "body",
                          parameters: [
                            {
                              type: "text",
                              text: carTitle
                            },
                            {
                              type: "text",
                              text: carRegistrationNumber
                            },
                            {
                              type: "text",
                              text: carModel
                            },
                            {
                              type: "text",
                              text: dealDoneAmount
                            },
                            {
                              type: "text",
                              text: tokenAmount
                            },
                            {
                                type: "text",
                                text:  paymentTo
                              },

                              {
                                type: "text",
                                text: paymentMode
                              },
                              {
                                type: "text",
                                text: customerName
                              },
                              {
                                type: "text",
                                text: customerAddress
                              },
                              {
                                type: "text",
                                text: loanOrCash
                              },
                              
                          ]
                        }
                      ]
                    }
                  }
                  
                  try {
                    const response = await axios.post(
                        `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
                        bodymessageownertemplate,
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
              





        
    } catch (error) {
        console.error('Error in uploadMediaAndSendMessage:', error);
        throw error.response?.data || error;
    }
}

module.exports = {uploadMediaAndSendMessage};















