import api from './api';

export const chatWithAI = async (message, history = []) => {
  const { data } = await api.post('/ai/chat', { message, history });
  return data.reply;
};

export const translateMessage = async (text, targetLanguage) => {
  const { data } = await api.post('/ai/translate', { text, targetLanguage });
  return data.translation;
};

export const splitTask = async (prompt) => {
  const { data } = await api.post('/ai/split-task', { prompt });
  return data.milestones;
};
