import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Users, MoreVertical, Phone, Video,
  Settings, Zap, Hash, Lock, Megaphone
} from 'lucide-react';
import ChatSidebar from '../components/Chat/ChatSidebar';
import MessageList from '../components/Chat/MessageList';
import InputBar from '../components/Chat/InputBar';
import FloatingAiBot from '../components/AI/FloatingAiBot';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import api from '../services/api';

const ChatApp = () => {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const typingTimeoutRef = useRef(null);

  // Fetch messages when chat is selected
  const fetchMessages = useCallback(async (chatId) => {
    setLoadingMessages(true);
    try {
      const { data } = await api.get(`/messages/${chatId}`);
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat._id);
      socket?.emit('join chat', selectedChat._id);
    }
  }, [selectedChat, fetchMessages, socket]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (newMessage) => {
      if (selectedChat && newMessage.chat._id === selectedChat._id) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const handleTyping = (room) => {
      if (room === selectedChat?._id) {
        setTypingUser(true);
      }
    };

    const handleStopTyping = (room) => {
      if (room === selectedChat?._id) {
        setTypingUser(null);
      }
    };

    socket.on('message received', handleMessage);
    socket.on('typing', handleTyping);
    socket.on('stop typing', handleStopTyping);

    return () => {
      socket.off('message received', handleMessage);
      socket.off('typing', handleTyping);
      socket.off('stop typing', handleStopTyping);
    };
  }, [socket, selectedChat]);

  const handleSelectChat = (chat) => {
    if (selectedChat?._id !== chat._id) {
      setSelectedChat(chat);
      setShowSidebar(false);
    }
  };

  const handleSend = async ({ content, file, attachmentType }) => {
    try {
      const { data } = await api.post('/messages', {
        content,
        chatId: selectedChat._id,
        attachmentType,
      });

      setMessages((prev) => [...prev, data]);

      // Emit to socket
      socket?.emit('new message', data);
      socket?.emit('stop typing', selectedChat._id);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleTyping = () => {
    socket?.emit('typing', selectedChat?._id);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket?.emit('stop typing', selectedChat?._id);
    }, 2000);
  };

  const getChatIcon = () => {
    if (!selectedChat) return null;
    if (selectedChat.isOfficial) return <Megaphone size={18} className="text-cyan-400" />;
    if (selectedChat.isGroupChat) return <Hash size={18} className="text-purple-400" />;
    return <Lock size={18} className="text-emerald-400" />;
  };

  return (
    <div className="h-screen bg-deep-zinc flex overflow-hidden">
      {/* Sidebar */}
      <div className={`${showSidebar ? 'block' : 'hidden'} md:block`}>
        <ChatSidebar
          selectedChat={selectedChat}
          onSelectChat={handleSelectChat}
          onNewChat={() => {}}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="h-16 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800/50 flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSidebar(true)}
                  className="md:hidden p-2 text-zinc-400 hover:text-white"
                >
                  <ArrowLeft size={20} />
                </button>

                <div className="w-10 h-10 rounded-xl bg-zinc-800/60 border border-zinc-700/30 flex items-center justify-center">
                  {getChatIcon()}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {selectedChat.chatName}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    {selectedChat.isGroupChat
                      ? `${selectedChat.users?.length || 0} members`
                      : isConnected
                      ? '● Online'
                      : '○ Offline'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 rounded-lg transition-colors">
                  <Phone size={18} />
                </button>
                <button className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 rounded-lg transition-colors">
                  <Video size={18} />
                </button>
                <button className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 rounded-lg transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            {loadingMessages ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <MessageList
                messages={messages}
                currentUserId={user?._id}
                typingUser={typingUser}
              />
            )}

            {/* Input */}
            <InputBar
              onSend={handleSend}
              onTyping={handleTyping}
              disabled={selectedChat.isOfficial && user?.role === 'student'}
            />
          </>
        ) : (
          /* No Chat Selected */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-600/20 to-cyan-600/20 border border-zinc-700/50 flex items-center justify-center"
              >
                <Zap size={32} className="text-purple-400" />
              </motion.div>
              <h3 className="text-xl font-display font-bold text-white mb-2">
                Welcome to CampusVibe
              </h3>
              <p className="text-sm text-zinc-500 max-w-xs">
                Select a chat from the sidebar or start a new conversation.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Floating AI Bot */}
      <FloatingAiBot />
    </div>
  );
};

export default ChatApp;
