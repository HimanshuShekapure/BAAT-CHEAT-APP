import { useEffect, useState, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./SidebarSkeleton";
import { Users } from "lucide-react";

// Assume each user object has: _id, fullName, profilePic, lastMessage, unreadCount

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    searchUsersByEmail,
    markAsRead,
    updateUserOnMessage,
    updateUserOnMessageForReceiver,
  } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchTimeout = useRef();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    if (!search) {
      setSearchResults([]);
      return;
    }
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      const results = await searchUsersByEmail(search);
      setSearchResults(results);
    }, 400);
    return () => clearTimeout(searchTimeout.current);
  }, [search, searchUsersByEmail]);

  // Sort users: most recent message at top
  const sortedUsers = [...(search ? searchResults : users)]
    .filter((user) => (showOnlineOnly ? onlineUsers?.includes(user._id) : true))
    .sort((a, b) => {
      // Sort by lastMessage time (descending)
      const aTime = a.lastMessage?.timestamp || 0;
      const bTime = b.lastMessage?.timestamp || 0;
      return bTime - aTime;
    });

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-80 flex flex-col transition-all duration-200 bg-zinc-900 shadow-xl border-r border-zinc-800">
      <div className="border-b border-zinc-800 w-full p-5">
        <div className="flex items-center gap-2 mb-3">
          <Users className="size-6 text-blue-400" />
          <span className="font-semibold hidden lg:block text-lg tracking-wide text-white">
            Chats
          </span>
        </div>
        {/* Search bar */}
        <div className="relative mb-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="input input-bordered input-sm w-full rounded-full pl-10 bg-zinc-800 text-white border-zinc-700 placeholder-zinc-400 focus:ring-2 focus:ring-blue-400 transition"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        {/* Online only filter */}
        <div className="mt-3 flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm text-white">Show online only</span>
          </label>
          <span className="text-xs text-zinc-400">
            ({(onlineUsers?.length ? onlineUsers.length - 1 : 0)} online)
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {sortedUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => {
              setSelectedUser(user);
              markAsRead(user._id); // Mark messages as read when opening chat
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-3
              hover:bg-zinc-800 transition-all duration-200
              ${
                selectedUser?._id === user._id
                  ? "bg-zinc-800 ring-2 ring-blue-400"
                  : ""
              }
              rounded-xl mb-2
            `}
          >
            <div className="relative">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.fullName}
                className={`w-12 h-12 object-cover rounded-full border-2 ${
                  onlineUsers?.includes(user._id)
                    ? "border-green-400 shadow-green-400/40 shadow-lg"
                    : "border-zinc-700"
                }`}
              />
              {onlineUsers?.includes(user._id) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-zinc-900 animate-pulse" />
              )}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="font-medium truncate text-white">
                {user.fullName}
              </div>
              <div className="text-xs text-zinc-400 truncate">
                {user.lastMessage?.text
                  ? user.lastMessage.text.length > 30
                    ? user.lastMessage.text.slice(0, 30) + "..."
                    : user.lastMessage.text
                  : "No messages yet"}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              {/* Time */}
              <span className="text-xs text-green-400">
                {user.lastMessage?.timestamp
                  ? new Date(user.lastMessage.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
              </span>
              {/* Unread badge */}
              {user.unreadCount > 0 && (
                <span className="bg-green-500 text-white text-xs rounded-full px-2 py-0.5 font-semibold">
                  {user.unreadCount}
                </span>
              )}
            </div>
          </button>
        ))}
        {sortedUsers.length === 0 && (
          <div className="text-center text-zinc-400 py-4">No users found</div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;