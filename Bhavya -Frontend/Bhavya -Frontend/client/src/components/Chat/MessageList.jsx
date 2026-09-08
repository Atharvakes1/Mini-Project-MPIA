import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Check, CheckCheck } from 'lucide-react';
import TranslationPill from '../AI/TranslationPill';

const MessageList = ({ messages, currentUserId, typingUser }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUser]);

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderAttachment = (msg) => {
    if (msg.attachmentType === 'none' || !msg.attachmentUrl) return null;

    if (msg.attachmentType === 'image' || msg.attachmentType === 'gif') {
      return (
        <img
          src={msg.attachmentUrl}
          alt="attachment"
          className="max-w-[280px] rounded-xl mt-2 border border-zinc-700/30"
          loading="lazy"
        />
      );
    }

    if (msg.attachmentType === 'voice') {
      return (
        <audio controls className="mt-2 max-w-[280px]">
          <source src={msg.attachmentUrl} />
        </audio>
      );
    }

    return (
      <a
        href={msg.attachmentUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800/60 border border-zinc-700 rounded-lg text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
      >
        📎 Download File
      </a>
    );
  };

  // Group messages by date
  const groupedMessages = [];
  let lastDate = '';

  messages.forEach((msg) => {
    const date = new Date(msg.createdAt).toLocaleDateString();
    if (date !== lastDate) {
      groupedMessages.push({ type: 'date', date });
      lastDate = date;
    }
    groupedMessages.push({ type: 'message', ...msg });
  });

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
      {groupedMessages.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-zinc-600 text-lg mb-1">💬</p>
            <p className="text-zinc-500 text-sm">No messages yet. Say hello!</p>
          </div>
        </div>
      )}

      {groupedMessages.map((item, i) => {
        if (item.type === 'date') {
          return (
            <div key={`date-${i}`} className="flex items-center justify-center py-3">
              <span className="text-[11px] text-zinc-600 bg-zinc-800/60 px-3 py-1 rounded-full">
                {item.date}
              </span>
            </div>
          );
        }

        const isMine = item.sender?._id === currentUserId;

        return (
          <motion.div
            key={item._id || i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex gap-2 group ${isMine ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            {!isMine && (
              <div className="w-8 h-8 rounded-lg bg-zinc-700/50 flex items-center justify-center flex-shrink-0 mt-1">
                {item.sender?.avatarUrl ? (
                  <img
                    src={item.sender.avatarUrl}
                    alt=""
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                ) : (
                  <span className="text-xs font-semibold text-zinc-400">
                    {item.sender?.name?.[0]?.toUpperCase() || '?'}
                  </span>
                )}
              </div>
            )}

            <div className={`max-w-[65%] ${isMine ? 'items-end' : 'items-start'}`}>
              {/* Sender name (groups) */}
              {!isMine && (
                <p className="text-[11px] text-zinc-500 mb-0.5 px-1">
                  {item.sender?.name}
                </p>
              )}

              {/* Bubble */}
              <div
                className={`px-3.5 py-2 ${
                  isMine
                    ? 'chat-bubble-sent'
                    : 'chat-bubble-received'
                }`}
              >
                {/* Content */}
                {item.content && (
                  <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap break-words">
                    {item.content}
                  </p>
                )}

                {/* Attachment */}
                {renderAttachment(item)}

                {/* Footer: time + read receipts + translate */}
                <div
                  className={`flex items-center gap-1.5 mt-1 ${
                    isMine ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <span className="text-[10px] text-zinc-600">
                    {formatTime(item.createdAt)}
                  </span>
                  {isMine && (
                    <span className="text-zinc-500">
                      {item.readBy?.length > 1 ? (
                        <CheckCheck size={12} className="text-cyan-400" />
                      ) : (
                        <Check size={12} />
                      )}
                    </span>
                  )}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <TranslationPill text={item.content} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Typing indicator */}
      {typingUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 px-2"
        >
          <div className="bg-zinc-800/60 border border-zinc-700/50 rounded-2xl rounded-bl-md px-4 py-2 flex gap-1.5 items-center">
            <span className="text-xs text-zinc-500">typing</span>
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
              className="w-1.5 h-1.5 bg-zinc-400 rounded-full"
            />
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              className="w-1.5 h-1.5 bg-zinc-400 rounded-full"
            />
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              className="w-1.5 h-1.5 bg-zinc-400 rounded-full"
            />
          </div>
        </motion.div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
