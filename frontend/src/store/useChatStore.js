import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/user");
      set({ users: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const authStore = useAuthStore.getState();
    const { socket, authUser } = authStore;
    if (!selectedUser?._id) {
      toast.error("No user selected");
      return;
    }
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
      // Emit real-time message
      if (socket && socket.connected) {
        socket.emit("send-message", {
          receiverId: selectedUser._id,
          message: { ...res.data, sender: authUser._id },
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send message");
    }
  },

  subscribeToMessages: () => {
    const authStore = useAuthStore.getState();
    const { socket } = authStore;
    const selectedUser = get().selectedUser;
    if (!socket || !selectedUser?._id) return;
    socket.off("receive-message");
    socket.on("receive-message", (newMessage) => {
      console.log("Received message:", newMessage, "Selected user:", selectedUser._id);
      // Only add if the message is from or to the selected user
      if (newMessage.sender === selectedUser._id || newMessage.receiver === selectedUser._id) {
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      }
    });
  },

  unsubscribeFromMessages: () => {
    const authStore = useAuthStore.getState();
    const { socket } = authStore;
    if (socket) {
      socket.off("receive-message");
    }
  },

  setSelectedUser: (selectedUser) => {
    const { unsubscribeFromMessages } = get();
    unsubscribeFromMessages(); // Clean up previous subscription
    set({ selectedUser, messages: [] }); // Reset messages when switching users
  },

  searchUsersByEmail: async (email) => {
    try {
      const res = await axiosInstance.get(`/messages/search-user`, { params: { email } });
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to search users");
      return [];
    }
  },
}));
