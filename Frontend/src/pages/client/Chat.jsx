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
import chat1 from "../../assets/chat1..jpg";
import EmojiPicker from "emoji-picker-react";
import { Smile } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { FaPhoneAlt, FaVideo } from "react-icons/fa";
import useWebRTC from "../../components/VideoCall/useWebRTC.js";
import VideoCall from "../../components/VideoCall/VideoCall.jsx";

export default function Chat() {
  const rawUser = JSON.parse(sessionStorage.getItem("user"));

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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [conversationsLoaded, setConversationsLoaded] = useState(false);

  const [incomingCall, setIncomingCall] = useState(null);
  const unreadKey = currentUser?.role === "client" ? "client" : "lawyer";
  const socketRef = useRef(null);

  const bottomRef = useRef(null);
  const isCallAcceptedRef = useRef(false);
  const { lawyerId } = useParams();

  const {
    peerConnection,
    localVideoRef,
    remoteVideoRef,
    startLocalMedia,
    createPeerConnection,
    createAnswer,
    endCall,
  } = useWebRTC();

  const [showVideoCall, setShowVideoCall] = useState(false);

  const [callPartnerId, setCallPartnerId] = useState(null);

  const normalizeSenderId = (sender) => {
    if (!sender) return null;
    if (typeof sender === "string") return sender;
    return sender._id || sender.id || null;
  };

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");

    if (!token) return;

    let socketInstance = getSocket();

    if (!socketInstance) {
      socketInstance = connectSocket(token);
    }

    socketRef.current = socketInstance;
  }, [currentUser?._id]);

  useEffect(() => {
    if (!conversationsLoaded) return;

    const initConversation = async () => {
      if (!lawyerId || !currentUser?._id) return;

      try {
        // CHECK EXISTING CONVERSATION
        const existingConversation = conversations.find((conv) =>
          conv.participants.some((p) => getUserId(p) === String(lawyerId)),
        );

        // IF EXISTS -> OPEN IT
        if (existingConversation) {
          openConversation(existingConversation);
          return;
        }

        // OTHERWISE CREATE NEW CONVERSATION
        const res = await createConversation(currentUser._id, lawyerId);
        console.log("CREATE CONVERSATION RESPONSE", res);

        const data = await getUserConversations(currentUser._id);

        const uniqueConversations = Array.from(
          new Map(
            (Array.isArray(data.data) ? data.data : []).map((c) => [c._id, c]),
          ).values(),
        );

        setConversations(uniqueConversations);

        const createdConversation = uniqueConversations.find((conv) =>
          conv.participants.some((p) => getUserId(p) === String(lawyerId)),
        );

        if (createdConversation) {
          openConversation(createdConversation);
        }
      } catch (err) {
        console.log("Conversation init error:", err);
      }
    };

    initConversation();
  }, [lawyerId, currentUser?._id, conversationsLoaded]);

  if (!currentUser?._id) {
    return <div>Invalid user</div>;
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
        setConversationsLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };

    load();
  }, [currentUser?._id]);

  useEffect(() => {
    const handler = (message) => {
      console.log("SOCKET MESSAGE:", message);

      setConversations((prev) =>
        prev.map((conv) => {
          if (conv._id !== message?.conversationId) {
            return conv;
          }

          return {
            ...conv,

            latestMessage: message,

            unreadCount:
              activeConversation?._id === message?.conversationId
                ? conv.unreadCount
                : {
                    ...conv.unreadCount,
                    [unreadKey]: (conv.unreadCount?.[unreadKey] || 0) + 1,
                  },
          };
        }),
      );

      if (message?.conversationId !== activeConversation?._id) return;

      setMessages((prev) => {
        const map = new Map(prev.map((m) => [String(m._id), m]));

        map.set(String(message._id), message);

        return Array.from(map.values());
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
          const senderId = m.sender?._id || m.sender;

          // ONLY MARK MY SENT MESSAGES
          if (String(senderId) === String(currentUser?._id)) {
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

    return () => socketRef.current?.off("messagesSeen", handler);
  }, [currentUser?._id]);

  useEffect(() => {
    const handler = (users) => {
      setOnlineUsers(Array.isArray(users) ? users : []);
    };

    socketRef.current?.on("onlineUsers", handler);
    return () => socketRef.current?.off("onlineUsers", handler);
  }, []);

  useEffect(() => {
    const handleTyping = () => setTyping(true);
    const handleStopTyping = () => setTyping(false);

    socketRef.current?.on("typing", handleTyping);
    socketRef.current?.on("stopTyping", handleStopTyping);

    return () => {
      socketRef.current?.off("typing", handleTyping);
      socketRef.current?.off("stopTyping", handleStopTyping);
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

      const uniqueMsgs = Array.from(
        new Map(msgs.map((m) => [String(m._id), m])).values(),
      );

      setMessages(uniqueMsgs);

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

  useEffect(() => {
    const socket = getSocket();

    if (!socket) return;

    const handleIncomingCall = (data) => {
      console.log("INCOMING CALL:", data);

      setIncomingCall(data);
    };

    socket.on("incoming-call", handleIncomingCall);

    socket.on("call-rejected", () => {
      setShowVideoCall(false);
      setCallPartnerId(null);
      setIncomingCall(null);
      endCall?.(); // optional if your hook supports cleanup
      // optional: toast "Call was rejected"
    });

    socket.on("call-ended", () => {
      endCall?.();
      setShowVideoCall(false);
      setCallPartnerId(null);
      setIncomingCall(null);
      // optional: toast "Call ended"
    });

    return () => {
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-rejected");
      socket.off("call-ended");
    };
  }, []);

  useEffect(() => {
    const socket = getSocket();

    if (!socket) return;

    socket.on("webrtc-offer", async ({ from, offer }) => {
      console.log("OFFER RECEIVED");

      await startLocalMedia();

      createPeerConnection(from);

      const answer = await createAnswer(offer, from);

      socket.emit("webrtc-answer", {
        to: from,
        answer,
      });
    });

    socket.on("webrtc-answer", async ({ answer }) => {
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(answer),
      );
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      try {
        if (candidate && peerConnection.current) {
          await peerConnection.current.addIceCandidate(
            new RTCIceCandidate(candidate),
          );
        }
      } catch (error) {
        console.log("ICE Candidate Error:", error);
      }
    });

    return () => {
      socket.off("webrtc-offer");
      socket.off("webrtc-answer");
      socket.off("ice-candidate");
    };
  }, []);

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
      messageId: uuidv4(),

      conversationId: activeConversation._id,

      sender: currentUser._id,

      senderModel: currentUser.role === "client" ? "Client" : "Lawyer",

      receiver: receiverId,

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

  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  const callReceiver = activeConversation?.participants?.find(
    (p) => getUserId(p) !== String(currentUser._id),
  );

  const receiverId = getUserId(callReceiver);

  const handleCall = async (callType) => {
    if (!activeConversation || !receiverId) return;

    const socket = getSocket();
    if (!socket?.connected) return;

    const stream = await startLocalMedia();
    if (!stream) return;

    const pc = createPeerConnection(receiverId);

    setCallPartnerId(receiverId);
    setShowVideoCall(true);

    socket.emit("call-user", {
      to: receiverId,
      from: currentUser._id,
      callType,
    });

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit("webrtc-offer", {
      to: receiverId,
      offer,
    });
  };

  const rejectCall = () => {
    const socket = getSocket();

    socket.emit("reject-call", {
      to: incomingCall.from,
    });

    isCallAcceptedRef.current = false;
    setIncomingCall(null);
  };

  const acceptCall = async () => {
    const stream = await startLocalMedia();
    if (!stream) return;

    isCallAcceptedRef.current = true;

    setCallPartnerId(incomingCall.from);
    setShowVideoCall(true);
    setIncomingCall(null);
  };
  return (
    <div className="flex h-screen bg-gray-100">
      <ChatSidebar
        conversations={conversations}
        currentUser={currentUser}
        onlineUsers={onlineUsers}
        activeConversation={activeConversation}
        openConversation={openConversation}
      />

      {!activeConversation ? (
        <div className="flex-1 flex items-center justify-center bg-gray-100 relative overflow-hidden">
          {/* BACKGROUND IMAGE */}
          <img
            src={chat1}
            alt="background"
            className="absolute inset-0 w-full h-full object-cover opacity-5"
          />

          {/* CONTENT */}
          <div className="text-center relative z-10">
            <h1 className="text-3xl font-semibold text-gray-700">
              Welcome to LexFlow Chat
            </h1>

            <p className="text-gray-500 mt-3 text-sm">
              Select a conversation to start messaging
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b bg-white flex items-center justify-between">
            {/* LEFT SIDE */}
            {activeParticipant ? (
              <div className="flex items-center gap-3">
                <img
                  src={
                    lawyerData?.profileImage ||
                    "https://ui-avatars.com/api/?name=User"
                  }
                  alt={lawyerData?.name}
                  className="w-12 h-12 rounded-full object-cover border"
                />

                <div className="flex flex-col">
                  <h2 className="font-semibold text-lg text-gray-800">
                    {lawyerData?.name || "Unknown User"}
                  </h2>

                  <span
                    className={`text-sm ${
                      isOnline ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            ) : (
              "Select conversation"
            )}

            {/* RIGHT SIDE */}
            <div className="flex gap-4">
              <button onClick={() => handleCall("video")} className=" text-lg">
                <FaVideo />
              </button>
              <button onClick={() => handleCall("audio")} className=" text-lg">
                <FaPhoneAlt />
              </button>
            </div>
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
                      key={String(msg._id)}
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
                              ? new Date(msg.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
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

          <div className="p-4 border-t bg-white relative">
            <div className="flex gap-2 items-center">
              {/* EMOJI BUTTON */}
              <button
                type="button"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <Smile size={22} />
              </button>

              {/* INPUT */}
              <input
                value={text}
                onChange={(e) => {
                  setText(e.target.value);

                  if (activeConversation?._id) {
                    socketRef.current?.emit("typing", activeConversation._id);
                  }
                }}
                onBlur={() => {
                  if (activeConversation?._id) {
                    socketRef.current?.emit(
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

              {/* SEND BUTTON */}
              <button
                onClick={sendMessage}
                disabled={!text.trim()}
                className="bg-black text-white px-5 py-2 rounded-xl disabled:opacity-50"
              >
                Send
              </button>
            </div>

            {/* EMOJI PICKER */}
            {showEmojiPicker && (
              <div className="absolute bottom-16 left-4 z-50">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
          </div>
        </div>
      )}

      {incomingCall && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-lg font-semibold">
              Incoming {incomingCall.callType} call
            </h2>

            <p className="mt-2">User is calling...</p>

            <div className="flex gap-4 mt-4">
              <button
                onClick={acceptCall}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Accept
              </button>

              <button
                onClick={rejectCall}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
      {showVideoCall && (
        <VideoCall
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
          onEndCall={() => { endCall(); setShowVideoCall(false); setCallPartnerId(null); }}
        />
      )}
    </div>
  );
}
