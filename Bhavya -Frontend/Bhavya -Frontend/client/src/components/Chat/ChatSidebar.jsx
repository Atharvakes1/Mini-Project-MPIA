import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Plus, Users, MessageCircle, Hash, Lock,
  Megaphone, MoreVertical, Archive
} from 'lucide-react';
import api from '../../services/api';

const ChatSidebar = ({ selectedChat, onSelectChat, onNewChat }) => {
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchChats = useCallback(async () => {
    try {
      const { data } = await api.get('/chats');
      setChats(data);
    } catch (err) {
      console.error('Failed to fetch chats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const filteredChats = chats.filter((chat) => {
    const matchSearch = chat.chatName
      ?.toLowerCase()
      .includes(search.toLowerCase());
    if (activeTab === 'official') return chat.isOfficial && matchSearch;
    if (activeTab === 'groups')
      return chat.isGroupChat && !chat.isOfficial && matchSearch;
    if (activeTab === 'dms') return !chat.isGroupChat && matchSearch;
    return matchSearch;
  });

  const tabs = [
    { key: 'all', label: 'All', icon: MessageCircle },
    { key: 'official', label: 'Official', icon: Megaphone },
    { key: 'groups', label: 'Clubs', icon: Hash },
    { key: 'dms', label: 'DMs', icon: Lock },
  ];

  const getChatDisplayName = (chat) => {
    if (chat.isGroupChat) return chat.chatName;
    const otherUser = chat.users?.find(
      (u) => u._id !== localStorage.getItem('campusvibe_user')
        ? JSON.parse(localStorage.getItem('campusvibe_user'))?._id
        : null
    );
    return otherUser?.name || chat.chatName;
  };

  return (
    <div className="w-80 bg-zinc-900/50 border-r border-zinc-800 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-bold text-white">Chats</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNewChat}
            className="p-2 rounded-xl bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 transition-colors"
          >
            <Plus size={18} />
          </motion.button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />
          <input
            type="text"
            placeholder="Search chats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl pl-9 pr-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-2 py-2 gap-1 border-b border-zinc-800/30">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-purple-600/20 text-purple-300'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
            }`}
          >
            <tab.icon size={12} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto py-2">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="text-center py-12 px-4">
            <MessageCircle size={32} className="text-zinc-700 mx-auto mb-3" />
            <p className="text-sm text-zinc-500">No chats found</p>
            <button
              onClick={onNewChat}
              className="text-xs text-purple-400 hover:text-purple-300 mt-2"
            >
              Start a new chat →
            </button>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <motion.button
              key={chat._id}
              whileHover={{ x: 2 }}
              onClick={() => onSelectChat(chat)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${
                selectedChat?._id === chat._id
                  ? 'bg-purple-600/10 border-l-2 border-purple-500'
                  : 'hover:bg-zinc-800/30 border-l-2 border-transparent'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  chat.isOfficial
                    ? 'bg-cyan-600/20 text-cyan-400'
                    : chat.isGroupChat
                    ? 'bg-purple-600/20 text-purple-400'
                    : 'bg-zinc-700/50 text-zinc-400'
                }`}
              >
                {chat.isOfficial ? (
                  <Megaphone size={18} />
                ) : chat.isGroupChat ? (
                  <Users size={18} />
                ) : (
                  <span className="text-sm font-semibold">
                    {getChatDisplayName(chat)?.[0]?.toUpperCase() || '?'}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white truncate">
                    {getChatDisplayName(chat)}
                  </span>
                  {chat.latestMessage && (
                    <span className="text-[10px] text-zinc-600 flex-shrink-0">
                      {new Date(chat.updatedAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 truncate mt-0.5">
                  {chat.latestMessage?.content || 'No messages yet'}
                </p>
              </div>
            </motion.button>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
