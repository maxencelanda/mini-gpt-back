const Messages = require("../models/messages");

const getMessages = async () => {
  try {
    const messages = await Messages.find();
    return messages;
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

const createMessage = async (content, sender) => {
  try {
    const newMessage = new Messages({ content, sender });
    await newMessage.save();
    return newMessage;
  } catch (error) {
    console.log(`Error creating message: ${error}`);
  }
};

module.exports = { getMessages, createMessage };
