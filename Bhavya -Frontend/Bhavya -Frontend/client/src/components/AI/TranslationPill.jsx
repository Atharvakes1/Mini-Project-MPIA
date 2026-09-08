import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages, X, ChevronDown } from 'lucide-react';
import { translateMessage } from '../../services/gemini';

const languages = [
  { code: 'Hindi', label: 'हिंदी' },
  { code: 'Spanish', label: 'Español' },
  { code: 'French', label: 'Français' },
  { code: 'German', label: 'Deutsch' },
  { code: 'Japanese', label: '日本語' },
  { code: 'Chinese', label: '中文' },
  { code: 'Arabic', label: 'العربية' },
  { code: 'Korean', label: '한국어' },
];

const TranslationPill = ({ text, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedLang, setSelectedLang] = useState(null);

  const handleTranslate = async (lang) => {
    setSelectedLang(lang);
    setLoading(true);
    try {
      const result = await translateMessage(text, lang.code);
      setTranslation(result);
    } catch {
      setTranslation('Translation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-md text-zinc-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
        title="Translate"
      >
        <Languages size={14} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute bottom-full right-0 mb-2 w-56 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl p-3 z-50"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-zinc-400 font-medium">Translate to</span>
              <button
                onClick={() => { setIsOpen(false); setTranslation(''); }}
                className="text-zinc-500 hover:text-white"
              >
                <X size={12} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1 mb-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleTranslate(lang)}
                  className={`text-xs px-2 py-1.5 rounded-lg transition-all ${
                    selectedLang?.code === lang.code
                      ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-zinc-400 hover:bg-zinc-700 hover:text-white'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {loading && (
              <div className="text-xs text-zinc-500 text-center py-2">Translating...</div>
            )}

            {translation && !loading && (
              <div className="mt-2 p-2 bg-zinc-900/60 rounded-lg border border-zinc-700/50">
                <p className="text-xs text-cyan-300 leading-relaxed">{translation}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TranslationPill;
