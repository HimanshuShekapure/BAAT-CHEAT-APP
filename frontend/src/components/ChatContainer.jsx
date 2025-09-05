import React, { useEffect, useRef, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';

const ChatContainer = () => {
  const { selectedUser, messages, getMessages, sendMessage, isMessagesLoading, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
  const { authUser, onlineUsers } = useAuthStore();
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }
    setText("");
    setImage(null);
    setPreview(null);
    
    // Cleanup on unmount
    return () => {
      unsubscribeFromMessages();
    };
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text && !image) return;
    let imageData = null;
    if (image) {
      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        imageData = reader.result;
        await sendMessage({ text, image: imageData });
        setText("");
        setImage(null);
        setPreview(null);
      };
      reader.readAsDataURL(image);
    } else {
      await sendMessage({ text });
      setText("");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Determine online status
  const isOnline = onlineUsers?.includes(selectedUser?._id);

  return (
    <div className="flex-1 flex flex-col h-full p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 p-2 border-b border-base-300">
        <img
          src={selectedUser?.profilePic || "/avatar.png"}
          alt={selectedUser?.fullName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="font-semibold">{selectedUser?.fullName}</span>
          <span className={`text-xs ${isOnline ? 'text-green-500' : 'text-zinc-400'}`}>{isOnline ? 'Online' : 'Offline'}</span>
        </div>
      </div>
      {/* Messages area */}
      <div className="flex-1 bg-base-200 rounded-lg p-4 overflow-y-auto flex flex-col gap-2">
        {isMessagesLoading ? (
          <div className="flex-1 flex items-center justify-center text-base-content/70">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-base-content/70">No messages yet. Say hi!</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id || Math.random()}
              className={`flex ${msg.sender === authUser?._id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs p-2 rounded-lg ${msg.sender === authUser?._id ? 'bg-primary text-primary-content' : 'bg-base-100 text-base-content'}`}>
                {msg.text && <div className="break-words">{msg.text}</div>}
                {msg.image && (
                  <img src={msg.image} alt="sent" className="mt-2 max-h-40 rounded" />
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Input area */}
      <form className="mt-4 flex gap-2 items-end" onSubmit={handleSend}>
        <input
          type="text"
          className="input input-bordered flex-1"
          placeholder="Type here..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="chat-image-upload"
          onChange={handleImageChange}
        />
        <label htmlFor="chat-image-upload" className="btn btn-ghost btn-square">
          📎
        </label>
        {preview && (
          <div className="relative">
            <img src={preview} alt="preview" className="w-12 h-12 object-cover rounded" />
            <button type="button" className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center" onClick={() => { setImage(null); setPreview(null); }}>
              ×
            </button>
          </div>
        )}
        <button type="submit" className="btn btn-primary">Send</button>
      </form>
    </div>
  );
};

export default ChatContainer; 