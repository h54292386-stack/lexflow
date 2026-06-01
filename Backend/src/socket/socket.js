let io;
let onlineUsers;

export const setSocketData = (
  socketIO,
  usersMap
) => {
  io = socketIO;
  onlineUsers = usersMap;
};

export const getIO = () => io;

export const getOnlineUsers =
  () => onlineUsers;