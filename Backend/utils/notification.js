import { Expo } from 'expo-server-sdk';

let expo = new Expo();

export const sendPushNotification = async (pushToken, title, body, data = {}) => {
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
    return;
  }

  const messages = [];
  messages.push({
    to: pushToken,
    sound: 'default',
    title: title,
    body: body,
    data: data,
  });

  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  
  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error(error);
    }
  }
  
  return tickets;
};
