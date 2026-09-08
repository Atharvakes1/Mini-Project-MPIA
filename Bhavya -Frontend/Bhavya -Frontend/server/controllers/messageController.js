import Message from '../models/Message.js';
import Chat from '../models/Chat.js';
import cloudinary from '../config/cloudinary.js';

// @route  POST /api/messages
// @desc   Send a new message
export const sendMessage = async (req, res) => {
  try {
    const { content, chatId, attachmentType } = req.body;

    if (!chatId) {
      return res.status(400).json({ message: 'chatId is required' });
    }

    let attachmentUrl = '';

    // Handle file upload via Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'campusvibe/messages',
        resource_type: 'auto',
      });
      attachmentUrl = result.secure_url;
    }

    // If attachment URL is directly provided (e.g., GIF URL)
    if (req.body.attachmentUrl) {
      attachmentUrl = req.body.attachmentUrl;
    }

    const messageData = {
      sender: req.user._id,
      content: content || '',
      chat: chatId,
      attachmentType: attachmentType || 'none',
      attachmentUrl,
      readBy: [req.user._id],
    };

    let message = await Message.create(messageData);

    message = await message.populate('sender', 'name avatarUrl email');
    message = await message.populate('chat');
    message = await Message.populate(message, {
      path: 'chat.users',
      select: 'name avatarUrl email',
    });

    // Update latest message in chat
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/messages/:chatId
// @desc   Get all messages for a chat (paginated)
export const getMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'name avatarUrl email')
      .populate('readBy', 'name')
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Message.countDocuments({ chat: req.params.chatId });

    res.json({
      messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/messages/:id/read
// @desc   Mark message as read
export const markAsRead = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { readBy: req.user._id } },
      { new: true }
    );

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
