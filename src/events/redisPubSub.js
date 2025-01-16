const redisClient = require("../dbStrategy/redisClient");

module.exports = async (io) => {
  const redisSubscriber = redisClient.duplicate();
  await redisSubscriber.connect();

  redisSubscriber.subscribe("messages:*", (message, channel) => {
    console.log(`Mensagem recebida no canal ${channel}:`, message);

    // Enviar mensagem recebida via WebSocket
    const [_, recipientId] = channel.split(":");
    io.to(recipientId).emit("new-message", JSON.parse(message));
  });
};