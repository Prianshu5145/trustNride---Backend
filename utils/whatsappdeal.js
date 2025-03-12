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
async function dealmessageandinvoice(phoneNumberId, messagingProduct,file,totalAmountGotTillNowExcludingToken,
    amountPaidToSatish,
    amountPaidToSatishBy,
    amountPaidToPiyush,
    amountPaidToCompanyAccount,
    amountPaidToPiyushBy,
    amountPaidToOmprakash,
    amountPaidToOmprakashBy,
    CustomerPaymentMode,
    tokenAmount,
    tokenAmountPaidTo,
    dealAmount,
    anyFinalDiscountFromDealAmount,
    holdFromCustomer,
    amountComeFromLoan,
    totalAmountGotFromCustomerTillNowIncludingToken,
    carTitle,
    carRegistrationNumber,
    customerWhatsappNumber,
    customerMobileNumber,
    customerName,
    customerAddress) {
    try {

        const token = process.env.token1;
    //send meassage customer -message1
    const bodytemplatemessage1customer = {
        
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: `+91${customerWhatsappNumber}`,
        type: "template",
        template: {
            name: "customercardeliverymessage",
            language: {
                code: "en_US"
            },
            components: [
                {
                    type: "body",
                    parameters: [
                      {
                        type: "text",
                        text: customerName
                      },
                      {
                        type: "text",
                        text: carTitle
                      },
                      
                    ]
                  }
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
        to: `+91${customerWhatsappNumber}`,
        type: "template",
        template: {
          name: "cardeliverycustomermessage2",
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
                filename: "Payment_Details_Agreement"
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
                  text: customerName
                },
                {
                  type: "text",
                  text: totalAmountGotTillNowExcludingToken
                },
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
        console.error(`Error sending message `, error);
    }
     

    



        
        
              //owners message and media-to all owner
              const recipients = ['+918400943441', '+919792983625', '+917518885222']; // Replace these with actual phone numbers

              for (let i = 0; i < recipients.length; i++) {
                  const bodymessageownertemplate = {
                    messaging_product: "whatsapp",
                    to: recipients[i],
                    type: "template",
                    template: {
                      name: "cardeliveryownermessage",
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
                          filename: "Payment_Details_Agreement"
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
                              text: totalAmountGotTillNowExcludingToken
                            },
                            {
                              type: "text",
                              text: amountPaidToSatish
                            },
                            {
                              type: "text",
                              text: amountPaidToSatishBy
                            },
                            {
                              type: "text",
                              text: amountPaidToPiyush
                            },
                            {
                                type: "text",
                                text:  amountPaidToPiyushBy
                              },

                              {
                                type: "text",
                                text: amountPaidToOmprakash
                              },
                              {
                                type: "text",
                                text: amountPaidToOmprakashBy
                              },
                              {
                                type: "text",
                                text: amountPaidToCompanyAccount
                              },
                              {
                                type: "text",
                                text: tokenAmount
                              },
                              {
                                type: "text",
                                text: tokenAmountPaidTo
                              },
                              {
                                type: "text",
                                text: dealAmount
                              },
                              {
                                type: "text",
                                text: anyFinalDiscountFromDealAmount
                              },
                              {
                                type: "text",
                                text: totalAmountGotFromCustomerTillNowIncludingToken
                              },
                              {
                                type: "text",
                                text: amountComeFromLoan
                              },
                              {
                                type: "text",
                                text: holdFromCustomer
                              },
                              {
                                type: "text",
                                text: carTitle
                              },
                              {
                                type: "text",
                                text: customerName
                              },
                              {
                                type: "text",
                                text: customerMobileNumber
                              },
                              {
                                type: "text",
                                text: customerAddress
                              },
                              {
                                type: "text",
                                text: carRegistrationNumber
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

module.exports = {dealmessageandinvoice};















