// utils/sms.js
const twilio = require('twilio');

// Create Twilio client with the credentials from the environment
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Function to send SMS
const sendSMS = async (to, message) => {
  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
      to, // The recipient's phone number
    });
    console.log('SMS sent successfully');
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw new Error('Error sending SMS');
  }
};

module.exports = sendSMS;
