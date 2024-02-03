const axios = require('axios');

const PHONE_NUMBER = 'YOUR_PHONE_NUMBER'; // Include country code, e.g., +1 for the United States
const SESSION_NAME = 'YOUR_SESSION_NAME'; // Unique identifier for your bot session
const AUTH_TOKEN = 'YOUR_AUTH_TOKEN'; // Authentication token obtained from WhatsApp

async function sendMessage(to, message) {
  try {
    const response = await axios.post(
      `https://api.chat-api.com/instance${SESSION_NAME}/sendMessage`,
      {
        phone: to,
        body: message,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`,
        },
      }
    );

    console.log(response.data);
  } catch (error) {
    console.error('Error sending message:', error.response.data);
  }
};

// Example: Send a message to a contact
const CONTACT_NUMBER = 'CONTACT_PHONE_NUMBER'; // Include country code
const MESSAGE_TEXT = 'Hello, this is a test message from your WhatsApp bot!';

sendMessage(CONTACT_NUMBER, MESSAGE_TEXT);








const fs = require('fs');

async function sendImage(to, imagePath, caption) {
  try {
    // Read the image file as a buffer
    const imageBuffer = fs.readFileSync(imagePath);

    // Convert the buffer to base64
    const base64Image = imageBuffer.toString('base64');

    // Make the API request to send the image
    const response = await axios.post(
      `https://api.chat-api.com/instance${SESSION_NAME}/sendFile`,
      {
        phone: to,
        body: caption, // Caption for the image
        filename: 'image.jpg',
        base64: base64Image,
        caption: caption,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`,
        },
      }
    );

    console.log(response.data);
  } catch (error) {
    console.error('Error sending image:', error.response.data);
  }
};

// Example: Send an image to a contact
const IMAGE_PATH = 'path/to/your/image.jpg';
const CAPTION = 'Check out this image!';

sendImage(CONTACT_NUMBER, IMAGE_PATH, CAPTION);

















const sendSticker = async (to, stickerPath) => {
  try {
    // Read the sticker file as a buffer
    const stickerBuffer = fs.readFileSync(stickerPath);

    // Convert the buffer to base64
    const base64Sticker = stickerBuffer.toString('base64');

    // Make the API request to send the sticker
    const response = await axios.post(
      `https://api.chat-api.com/instance${sessionName}/sendSticker`,
      {
        phone: to,
        base64: base64Sticker,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      }
    );

    console.log(response.data);
  } catch (error) {
    console.error('Error sending sticker:', error.response.data);
  }
};

// Example: Send a sticker to a contact
const STICKER_PATH = 'path/to/your/sticker.webp';

sendSticker(CONTACT_NUMBER, STICKER_PATH);