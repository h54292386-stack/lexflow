// import { io } from "socket.io-client";

// let socket = null;

// export const connectSocket = (token) => {
//   if (!token) return null;

//   const cleanToken = token.replace("Bearer ", "");

//   socket = io("http://localhost:5000", {
//     auth: { token: cleanToken },
//   });

//   socket.on("connect", () => {
//     console.log("SOCKET CONNECTED:", socket.id);
//   });

//   socket.on("disconnect", (reason) => {
//     console.log("SOCKET DISCONNECTED:", reason);
//   });

//   socket.on("connect_error", (err) => {
//     console.log("SOCKET ERROR:", err.message);
//   });

//   return socket;
// };



// export const getSocket = () => socket;

// export const disconnectSocket = () => {
//   if (socket) {
//     socket.disconnect();
//     socket = null;
//   }
// };

import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (token) => {

  if (!token) return null;

  // Prevent duplicate connections
  if (socket?.connected) {
    return socket;
  }

  const cleanToken =
    token.replace("Bearer ", "");

  socket = io("http://localhost:5000", {
    auth: {
      token: cleanToken,
    },
  });

  socket.on("connect", () => {
    console.log(
      "SOCKET CONNECTED:",
      socket.id
    );
  });

  socket.on("disconnect", (reason) => {
    console.log(
      "SOCKET DISCONNECTED:",
      reason
    );
  });

  socket.on("connect_error", (err) => {
    console.log(
      "SOCKET ERROR:",
      err.message
    );
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {

  if (socket) {

    socket.disconnect();

    socket = null;
  }
};