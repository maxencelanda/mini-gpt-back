const { Server } = require('socket.io');
const { getMessages, createMessage } = require('./controllers/messagesController');

const websocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', async (socket) => {
    console.log('a user connected');

    const messagesHistory = await getMessages();
    for (message of messagesHistory) {
      io.emit('message', {user: message.sender, message: message.content});
    }

    socket.on('message', async (msg) => {
      io.emit('message', {user: "user", message: msg});
      const response = await queryModelWithFetch(msg);
      const responseContent = response[0].generated_text;
      io.emit('message', {user: "ai", message: responseContent});
      createMessage(msg, "user");
      createMessage(responseContent, "ai");
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

  console.log("WebSocket server running...");
};

async function queryModelWithFetch(inputText) {
  const MODEL_NAME = "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B";

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${MODEL_NAME}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: inputText,
        }),
      }
    );

    if (!response.ok) {
      console.log(`HTTP error! status: ${response.status}`);
      return [{generated_text: 'There has been a problem with the response, please try again.'}]
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error:", error);
    return [{generated_text: 'There has been a problem with the response, please try again.'}]
  }
}

module.exports = { websocket };
