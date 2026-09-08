import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI = null;

const getGenAI = () => {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};

// @route  POST /api/ai/chat
// @desc   Campus AI chatbot with Gemini
export const aiChat = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const isKeyValid = apiKey && apiKey !== 'your_gemini_api_key_here' && apiKey.trim().length > 10;

    if (!isKeyValid) {
      // Provide intelligent campus fallback answers for GLBITM
      const lower = message.toLowerCase();
      let fallbackReply = "I'm CampusVibe AI for GLBITM! I can help you with campus navigation, library hours, clubs, fests, and exam prep. What would you like to know?";
      
      if (lower.includes('library')) {
        fallbackReply = "Central Library is open from 8:30 AM to 8:00 PM on weekdays, and 9:00 AM to 5:00 PM on Saturdays. Digital library access is available 24/7 through the campus portal!";
      } else if (lower.includes('fest') || lower.includes('event')) {
        fallbackReply = "GLBITM hosts annual tech fests and cultural nights! Check out the Clubs & Fests hub in CampusVibe for current schedules, auditions, and registration links.";
      } else if (lower.includes('exam') || lower.includes('schedule') || lower.includes('date sheet')) {
        fallbackReply = "Exam schedules, sessional dates, and seating plans are published in the Official Campus Announcements channel. Keep an eye on verified admin posts!";
      } else if (lower.includes('club') || lower.includes('society')) {
        fallbackReply = "We have active clubs including Coding Club (CSI/IEEE), Robotics Society, Drama & Dance clubs, and Sports councils. You can join their channels directly in CampusVibe!";
      } else if (lower.includes('join') || lower.includes('login') || lower.includes('account')) {
        fallbackReply = "You can join using your verified @glbitm.ac.in college email address. Just click 'Get Started' to sign up or sign in!";
      } else if (lower.includes('relay') || lower.includes('task')) {
        fallbackReply = "The Relay Task system lets you split projects into 4 sequential stages (Frontend, AI, Backend, Testing) and pass tasks between team members automatically!";
      }

      return res.json({ reply: fallbackReply });
    }

    const model = getGenAI().getGenerativeModel({ model: 'gemini-1.5-flash' });

    const systemPrompt = `You are CampusVibe AI, a helpful campus assistant for GL Bajaj Institute of Technology and Management (GLBITM). You help students with:
- Campus navigation and facilities
- Exam schedules and curriculum info
- Club and fest details
- Library hours and resources
- General academic queries
- Student life tips

Be friendly, concise, and helpful. If you don't know something specific about the campus, say so honestly and suggest where the student might find that information.`;

    const chatHistory = (history || []).map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: 'What can you help me with?' }] },
        { role: 'model', parts: [{ text: systemPrompt }] },
        ...chatHistory,
      ],
    });

    const result = await chat.sendMessage(message);
    const response = result.response.text();

    res.json({ reply: response });
  } catch (error) {
    console.error('AI Chat Error:', error);
    // Provide friendly fallback on error
    res.json({
      reply: "I'm having a brief connection hiccup with the AI model right now, but feel free to ask about library hours, clubs, fests, or campus schedules!",
    });
  }
};

// @route  POST /api/ai/translate
// @desc   Translate message text using Gemini
export const translateMessage = async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({ message: 'text and targetLanguage required' });
    }

    const model = getGenAI().getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Translate the following text to ${targetLanguage}. Only return the translation, nothing else.\n\nText: "${text}"`;

    const result = await model.generateContent(prompt);
    const translation = result.response.text();

    res.json({ translation: translation.trim() });
  } catch (error) {
    console.error('Translation Error:', error);
    res.status(500).json({ message: 'Translation service unavailable' });
  }
};

// @route  POST /api/ai/split-task
// @desc   Split assignment into 4 sequential milestones
export const splitTask = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Assignment prompt is required' });
    }

    const model = getGenAI().getGenerativeModel({ model: 'gemini-1.5-flash' });

    const aiPrompt = `You are a project management AI. Break down the following assignment into exactly 4 sequential milestones for a relay-style team workflow. Each milestone should be handed off to the next team member in sequence.

The 4 roles are:
1. UI/UX Design & Frontend
2. AI/ML Integration
3. Backend Development
4. Testing, Deployment & Documentation

For each milestone, provide:
- A short title (max 6 words)
- A description of the work (2-3 sentences)

Format your response as JSON array:
[
  { "title": "...", "description": "..." },
  { "title": "...", "description": "..." },
  { "title": "...", "description": "..." },
  { "title": "...", "description": "..." }
]

Assignment: "${prompt}"

Return ONLY the JSON array, no markdown formatting.`;

    const result = await model.generateContent(aiPrompt);
    let text = result.response.text().trim();

    // Clean up potential markdown code fences
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const milestones = JSON.parse(text);
    res.json({ milestones });
  } catch (error) {
    console.error('Task Split Error:', error);
    res.status(500).json({ message: 'AI task splitting unavailable' });
  }
};
