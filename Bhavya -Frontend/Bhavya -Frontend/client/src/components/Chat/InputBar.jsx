import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Smile, Paperclip, Mic, Image, X, FileText
} from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

const InputBar = ({ onSend, onTyping, disabled }) => {
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [showAttach, setShowAttach] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleSend = () => {
    if (!text.trim() && !selectedFile) return;

    onSend({
      content: text.trim(),
      file: selectedFile,
      attachmentType: selectedFile
        ? selectedFile.type.startsWith('image/')
          ? 'image'
          : 'file'
        : 'none',
    });

    setText('');
    setSelectedFile(null);
    setShowEmoji(false);
    setShowAttach(false);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
    onTyping?.();
  };

  const onEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
    textareaRef.current?.focus();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setShowAttach(false);
    }
  };

  return (
    <div className="border-t border-zinc-800/50 bg-zinc-900/50 p-3">
      {/* Selected file preview */}
      <AnimatePresence>
        {selectedFile && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-2"
          >
            <div className="flex items-center gap-2 px-3 py-2 bg-zinc-800/60 border border-zinc-700/50 rounded-xl">
              <FileText size={16} className="text-purple-400" />
              <span className="text-xs text-zinc-300 truncate flex-1">
                {selectedFile.name}
              </span>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-zinc-500 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-end gap-2">
        {/* Emoji toggle */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setShowEmoji(!showEmoji); setShowAttach(false); }}
            className={`p-2 rounded-xl transition-colors ${
              showEmoji
                ? 'bg-purple-600/20 text-purple-400'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
            }`}
          >
            <Smile size={20} />
          </motion.button>

          <AnimatePresence>
            {showEmoji && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-12 left-0 z-50"
              >
                <EmojiPicker
                  theme="dark"
                  width={320}
                  height={400}
                  onEmojiClick={onEmojiClick}
                  searchDisabled={false}
                  skinTonesDisabled
                  previewConfig={{ showPreview: false }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Attachment */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setShowAttach(!showAttach); setShowEmoji(false); }}
            className="p-2 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors"
          >
            <Paperclip size={20} />
          </motion.button>

          <AnimatePresence>
            {showAttach && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-12 left-0 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl p-2 z-50 min-w-[140px]"
              >
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-300 hover:bg-zinc-700/50 transition-colors"
                >
                  <Image size={14} className="text-cyan-400" />
                  Photo / Image
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-300 hover:bg-zinc-700/50 transition-colors"
                >
                  <FileText size={14} className="text-purple-400" />
                  Document
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
        </div>

        {/* Text input */}
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={disabled}
            rows={1}
            className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 resize-none transition-colors"
            style={{ minHeight: '40px', maxHeight: '120px' }}
            onInput={(e) => {
              e.target.style.height = '40px';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
          />
        </div>

        {/* Send */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          disabled={(!text.trim() && !selectedFile) || disabled}
          className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Send size={18} />
        </motion.button>
      </div>
    </div>
  );
};

export default InputBar;
