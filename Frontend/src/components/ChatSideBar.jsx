import { FaSearch, FaUserCircle } from "react-icons/fa";
import { getUserId } from "../Utils/chatUtils.js";
import { safeDecrypt } from "../Utils/crypto.js";

export default function ChatSidebar({
  conversations,
  currentUser,
  onlineUsers,
  activeConversation,
  openConversation,
}) {
  return (
    <div className="w-[320px] h-full bg-white border-r flex flex-col">
      <div className="p-5 border-b sticky top-0 bg-white z-10">
        <h1 className="text-2xl font-bold text-gray-800">Chats</h1>

        <div className="mt-4 flex items-center bg-gray-100 px-3 py-2 rounded-xl">
          <FaSearch className="text-gray-400" />

          <input
            type="text"
            placeholder="Search chats..."
            className="bg-transparent outline-none ml-3 w-full text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations?.map((conv) => {
          const other = conv?.participants?.find((p) => {
            const participantId = String(
              p?.userId?._id || p?.userId?.id || p?.userId,
            );
            return participantId !== String(currentUser?._id);
          });

          const otherUser = other?.userId || other;

          const otherId = String(otherUser?._id || otherUser?.id || otherUser);
          const online = onlineUsers.some(
            (id) => String(id) === String(otherId),
          );

          const unreadCount =
            currentUser?.role?.toLowerCase() === "client"
              ? conv?.unreadCount?.client
              : conv?.unreadCount?.lawyer;

          return (
            <div
              key={conv?._id}
              onClick={() => openConversation(conv)}
              className={`flex items-center gap-3 p-4 cursor-pointer transition-all border-b
                ${
                  activeConversation?._id === conv?._id
                    ? "bg-blue-50"
                    : "hover:bg-gray-100"
                }`}
            >
              <div className="relative">
                {otherUser?.profileImage ? (
                  <img
                    src={otherUser.profileImage}
                    alt={otherUser?.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="text-5xl text-gray-400" />
                )}

                <span
                  className={`absolute bottom-1 right-1 w-3 h-3 rounded-full border-2 border-white
                    ${online ? "bg-green-500" : "bg-gray-400"}`}
                />
              </div>

              <div className="flex-1 overflow-hidden">
                {/* TOP ROW */}
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-800 truncate">
                    {otherUser?.name || "Unknown"}
                  </h2>

                  {conv?.latestMessage?.createdAt && (
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {new Date(
                        conv.latestMessage.createdAt,
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </div>

                {/* BOTTOM ROW */}
                <div className="flex items-center justify-between mt-1">
                  <div
                    className={`text-sm truncate flex items-center gap-1 ${
                      unreadCount > 0
                        ? "font-semibold text-black"
                        : "text-gray-500"
                    }`}
                  >
                    {/* SEEN TICKS */}
                    {String(
                      conv?.latestMessage?.sender?._id ||
                        conv?.latestMessage?.sender,
                    ) === String(currentUser?._id) && (
                      <span
                        className={
                          conv?.latestMessage?.seen
                            ? "text-blue-500"
                            : "text-gray-400"
                        }
                      >
                        {conv?.latestMessage?.seen ? "✓✓" : "✓"}
                      </span>
                    )}

                    {/* LAST MESSAGE */}
                    <span className="truncate">
                      {conv?.typing
                        ? "Typing..."
                        : safeDecrypt(conv?.latestMessage?.text) ||
                          "No messages yet"}
                    </span>
                  </div>

                  {/* UNREAD COUNT */}
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
