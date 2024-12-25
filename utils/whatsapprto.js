
const axios = require('axios');

/**
 * Sends WhatsApp text messages via Facebook Graph API for multiple recipients manually declared within the function.
 *
 * @param {string} phoneNumberId - The phone number ID associated with your WhatsApp Business Account.
 * @param {string} token - The access token for authentication.
 * @returns {Promise<void>} - Resolves when all messages are sent successfully.
 */
async function sendTextMessages(ownerphonenumber, ownermessage, customermessage, agentmessage, agentPhoneNumber) {
    const phoneNumberId = process.env.phoneNumberId;
    const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;
    const token = process.env.token1;

    // Manually declare recipients
    const recipients = [
        { phoneNumber: '8400943441', message: ownermessage },
        { phoneNumber: '9792983625', message: ownermessage },
        { phoneNumber: '9628674776', message: ownermessage },
        { phoneNumber: ownerphonenumber, message: customermessage },
        { phoneNumber: agentPhoneNumber, message: agentmessage },
    ];

    for (let i = 0; i < recipients.length; i++) {
        const { phoneNumber, message } = recipients[i];

        const body = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: `+91${phoneNumber}`,
            type: "text",
            text: {
                preview_url: false,
                body: message,
            },
        };

        try {
            const response = await axios.post(url, body, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log(`Message ${i + 1} sent successfully:`, response.data);
        } catch (error) {
            console.error(`Error sending message to ${phoneNumber}:`, error.message);
            // Continue sending other messages even if this one fails
        }
    }
}




    
   
    


module.exports = { sendTextMessages };