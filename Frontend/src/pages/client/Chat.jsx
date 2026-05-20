import { useEffect, useState, useRef } from "react";
import { connectSocket, getSocket } from "../../socket.js";
import {
  getMessages,
  getUserConversations,
  createConversation,
} from "../../service/AuthService.js";
import { useParams } from "react-router-dom";
import ChatSidebar from "../../components/ChatSideBar.jsx";
import { getUserId } from "../../Utils/chatUtils.js";
import { safeDecrypt } from "../../Utils/crypto.js";

export default function Chat() {
  const rawUser = JSON.parse(localStorage.getItem("user"));

  const currentUser = rawUser
    ? {
        ...rawUser,
        _id: rawUser._id || rawUser.id,
      }
    : null;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const [onlineUsers, setOnlineUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);

  const unreadKey = currentUser?.role === "client" ? "client" : "lawyer";
  const socketRef = useRef(null);

  const bottomRef = useRef(null);
  const { lawyerId } = useParams();

  const normalizeSenderId = (sender) => {
    if (!sender) return null;
    if (typeof sender === "string") return sender;
    return sender._id || sender.id || null;
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) return;

    let socketInstance = getSocket();

    if (!socketInstance) {
      socketInstance = connectSocket(token);
    }

    socketRef.current = socketInstance;
  }, [currentUser?._id]);

  useEffect(() => {
    const init = async () => {
      if (!lawyerId || !currentUser?._id) {
        console.log("MISSING DATA:", { lawyerId, currentUser });
        return;
      }

      try {
        const res = await createConversation(currentUser._id, lawyerId);

        const conv = res.data;

        if (!conv?._id) {
          console.log("Invalid conversation returned");
          return;
        }

        setActiveConversation(conv);

        socketRef.current?.emit("joinConversation", conv._id);
        const msgsRes = await getMessages(conv._id);

        setMessages(msgsRes.data || []);
      } catch (err) {
        console.log("INIT ERROR:", err);
      }
    };

    init();
  }, [lawyerId, currentUser?._id]);

  if (!currentUser?._id) {
    return <div>Invalid user</div>;
  }

  if (!lawyerId) {
    return <div>Invalid lawyer</div>;
  }

  useEffect(() => {
    if (!currentUser?._id) return;

    const load = async () => {
      try {
        const data = await getUserConversations(currentUser._id);

        const uniqueConversations = Array.from(
          new Map(
            (Array.isArray(data.data) ? data.data : []).map((c) => [c._id, c]),
          ).values(),
        );

        setConversations(uniqueConversations);
      } catch (err) {
        console.log(err);
      }
    };

    load();
  }, [currentUser?._id]);

  useEffect(() => {
    const handler = (message) => {
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv._id !== message?.conversationId) return conv;

          if (activeConversation?._id === message?.conversationId) {
            return conv;
          }

          return {
            ...conv,
            unreadCount: {
              ...conv.unreadCount,
              [unreadKey]: (conv.unreadCount?.[unreadKey] || 0) + 1,
            },
          };
        }),
      );

      if (message?.conversationId !== activeConversation?._id) return;

      setMessages((prev) => {
        const exists = prev.some((m) => {
          const oldSender = m.sender?._id || m.sender;

          const newSender = message.sender?._id || message.sender;

          return (
            String(oldSender) === String(newSender) &&
            m.text === message.text &&
            Math.abs(new Date(m.createdAt) - new Date(message.createdAt)) < 5000
          );
        });
        if (exists) return prev;

        return [...prev, message];
      });

      const senderId = message.sender?._id || message.sender;

      if (String(senderId) !== String(currentUser?._id)) {
        socketRef.current?.emit("markSeen", {
          conversationId: message.conversationId,
          userId: currentUser?._id,
          userModel: currentUser?.role === "client" ? "Client" : "Lawyer",
        });
      }
    };

    socketRef.current?.on("receiveMessage", handler);

    return () => socketRef.current?.off("receiveMessage", handler);
  }, [activeConversation?._id, currentUser?._id]);

useEffect(() => {
  const handler = () => {
    setMessages((prev) =>
      prev.map((m) => {
        const senderId =
          m.sender?._id || m.sender;

        // ONLY MARK MY SENT MESSAGES
        if (
          String(senderId) ===
          String(currentUser?._id)
        ) {
          return {
            ...m,
            seen: true,
          };
        }

        return m;
      }),
    );
  };

  socketRef.current?.on("messagesSeen", handler);

  return () =>
    socketRef.current?.off(
      "messagesSeen",
      handler,
    );
}, [currentUser?._id]);

  useEffect(() => {
    const handler = (users) => {
      setOnlineUsers(Array.isArray(users) ? users : []);
    };

    socketRef.current?.on("onlineUsers", handler);
    return () => socketRef.current?.off("onlineUsers", handler);
  }, []);

  useEffect(() => {
    socketRef.current?.on("typing", () => setTyping(true));
    socketRef.current?.on("stopTyping", () => setTyping(false));

    return () => {
      socketRef.current?.off("typing");
      socketRef.current?.off("stopTyping");
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    setTyping(false);
  }, [activeConversation]);

  const openConversation = async (conv) => {
    if (!conv?._id) return;

    setActiveConversation(conv);

    setConversations((prev) => {
      const exists = prev.some((c) => c._id === conv._id);

      if (exists) return prev;

      return [conv, ...prev];
    });

    // CLEAR OLD MESSAGES IMMEDIATELY
    setMessages([]);

    // SHOW LOADER
    setIsLoadingMessages(true);

    socketRef.current?.emit("joinConversation", conv._id);

    try {
      const res = await getMessages(conv._id);

      const msgs = Array.isArray(res.data) ? res.data : [];

      setMessages(msgs);

      // RESET UNREAD COUNT IN SIDEBAR
      setConversations((prev) =>
        prev.map((c) =>
          c._id === conv._id
            ? {
                ...c,
                unreadCount: {
                  ...c.unreadCount,
                  [unreadKey]: 0,
                },
              }
            : c,
        ),
      );
    } catch (err) {
      console.log(err);
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }

    socketRef.current?.emit("markSeen", {
      conversationId: conv._id,
      userId: currentUser?._id,
      userModel: currentUser?.role === "client" ? "Client" : "Lawyer",
    });
  };

  const sendMessage = () => {
    const cleanText = text.trim();

    if (!cleanText) return;

    if (!activeConversation?._id) return;

    if (!socketRef.current?.connected) {
      console.log("Socket not connected");
      return;
    }

    const receiver = activeConversation?.participants?.find(
      (p) => getUserId(p) !== String(currentUser._id),
    );

    console.log("RECEIVER:", receiver);

    // FIX: Extract only the ID
    const receiverId = getUserId(receiver);

    console.log("RECEIVER ID:", receiverId);
    console.log("TYPE:", typeof receiverId);

    if (!receiverId) {
      console.log("NO RECEIVER ID");
      return;
    }

    const payload = {
      conversationId: activeConversation._id,

      sender: currentUser._id,

      // FIX: Capitalized enum values
      senderModel: currentUser.role === "client" ? "Client" : "Lawyer",

      receiver: receiverId,

      // FIX: Correct lowercase condition
      receiverModel: currentUser.role === "client" ? "Lawyer" : "Client",

      text: cleanText,
    };
    console.log("SOCKET CONNECTED:", socketRef.current?.connected);

    console.log("SENDING PAYLOAD:", payload);

    socketRef.current?.emit("sendMessage", payload);

    setText("");
    socketRef.current?.emit("stopTyping", activeConversation._id);
  };

  const activeParticipant = activeConversation?.participants?.find((p) => {
    const participantId = String(p?.userId?._id || p?.userId?.id || p?.userId);

    return participantId !== String(currentUser?._id);
  });

  const lawyerData =
    typeof activeParticipant?.userId === "object"
      ? activeParticipant.userId
      : activeParticipant;
  const activeUserId = String(
    lawyerData?._id ||
      lawyerData?.id ||
      activeParticipant?.userId ||
      lawyerData,
  );
  const isOnline = onlineUsers.some((id) => String(id) === activeUserId);

  return (
    <div className="flex h-screen bg-gray-100">
      {activeConversation ? (
        <>
          <ChatSidebar
            conversations={conversations}
            currentUser={currentUser}
            onlineUsers={onlineUsers}
            activeConversation={activeConversation}
            openConversation={openConversation}
          />
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b bg-white">
              {activeParticipant ? (
                <div className="flex items-center gap-3">
                  {/* PROFILE IMAGE */}
                  <img
                    src={
                      lawyerData?.profileImage ||
                      "https://ui-avatars.com/api/?name=User"
                    }
                    alt={lawyerData?.name}
                    className="w-12 h-12 rounded-full object-cover border"
                  />

                  {/* USER INFO */}
                  <div className="flex flex-col">
                    <h2 className="font-semibold text-lg text-gray-800">
                      {lawyerData?.name || "Unknown User"}
                    </h2>

                    {/* ONLINE STATUS */}
                    <span
                      className={`text-sm ${
                        isOnline ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {isOnline ? " Online" : "Offline"}
                    </span>

                    {/* LAST SEEN */}
                    {!isOnline && activeParticipant?.userId?.lastSeen && (
                      <span className="text-xs text-gray-400">
                        Last seen:{" "}
                        {new Date(lawyerData?.lastSeen).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                "Select conversation"
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {isLoadingMessages ? (
                <div className="flex justify-center items-center h-full">
                  <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  {messages.map((msg, i) => {
                    const isMe =
                      String(normalizeSenderId(msg.sender)) ===
                      String(currentUser._id);

                    return (
                      <div
                        key={msg?._id || i}
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div className="max-w-[75%] flex flex-col">
                          {/* MESSAGE BUBBLE */}
                          <div
                            className={`px-4 py-2 shadow-sm text-sm break-words ${
                              isMe
                                ? "bg-black text-white rounded-2xl rounded-tr-none"
                                : "bg-white text-gray-800 rounded-2xl rounded-tl-none border"
                            }`}
                          >
                            {safeDecrypt(msg?.text)}
                          </div>

                          {/* TIME + STATUS */}
                          <div
                            className={`flex items-center gap-1 mt-1 text-xs text-gray-400 ${
                              isMe ? "justify-end" : "justify-start"
                            }`}
                          >
                            <span>
                              {msg?.createdAt
                                ? new Date(msg.createdAt).toLocaleTimeString(
                                    [],
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    },
                                  )
                                : ""}
                            </span>

                            {/* MESSAGE STATUS */}
                            {isMe && (
                              <span
                                className={`font-semibold ${
                                  msg?.seen ? "text-blue-500" : "text-gray-400"
                                }`}
                              >
                                {msg?.seen ? "✓✓" : "✓"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}

              {/* TYPING INDICATOR */}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-white border px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                    <div className="flex gap-1 items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                      <span
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.15s" }}
                      ></span>
                      <span
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.3s" }}
                      ></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            <div className="p-4 border-t flex gap-2 bg-white">
              <input
                value={text}
                onChange={(e) => {
                  setText(e.target.value);

                  if (activeConversation?._id) {
                    socketRef.current.emit("typing", activeConversation._id);
                  }
                }}
                onBlur={() => {
                  if (activeConversation?._id) {
                    socketRef.current.emit(
                      "stopTyping",
                      activeConversation._id,
                    );
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && text.trim()) {
                    sendMessage();
                  }
                }}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-black"
              />
              <button
                onClick={sendMessage}
                disabled={!text.trim()}
                className="bg-black text-white px-5 py-2 rounded-xl disabled:opacity-50"
              >
                Send
              </button>{" "}
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center w-full">
          Loading chat...
        </div>
      )}
    </div>
  );
}
