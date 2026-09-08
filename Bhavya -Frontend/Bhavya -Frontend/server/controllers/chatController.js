import Chat from '../models/Chat.js';
import User from '../models/User.js';
import Message from '../models/Message.js';

// @route  POST /api/chats
// @desc   Access or create a 1-on-1 chat
export const accessChat = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'userId param required' });
    }

    let chat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate('users', '-password')
      .populate('latestMessage');

    chat = await User.populate(chat, {
      path: 'latestMessage.sender',
      select: 'name avatarUrl email',
    });

    if (chat.length > 0) {
      return res.json(chat[0]);
    }

    const newChat = await Chat.create({
      chatName: 'direct',
      isGroupChat: false,
      users: [req.user._id, userId],
    });

    const fullChat = await Chat.findById(newChat._id).populate(
      'users',
      '-password'
    );

    res.status(201).json(fullChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/chats
// @desc   Fetch all chats for the user
export const fetchChats = async (req, res) => {
  try {
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 });

    chats = await User.populate(chats, {
      path: 'latestMessage.sender',
      select: 'name avatarUrl email',
    });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  POST /api/chats/group
// @desc   Create a new group chat
export const createGroupChat = async (req, res) => {
  try {
    const { name, users, isOfficial } = req.body;

    if (!name || !users || users.length < 2) {
      return res
        .status(400)
        .json({ message: 'Group requires a name and at least 2 other users' });
    }

    const allUsers = [...users, req.user._id.toString()];

    const groupChat = await Chat.create({
      chatName: name,
      isGroupChat: true,
      isOfficial: isOfficial || false,
      users: allUsers,
      groupAdmin: req.user._id,
    });

    const fullChat = await Chat.findById(groupChat._id)
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(201).json(fullChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/chats/group/:id
// @desc   Rename group / update wallpaper
export const updateGroupChat = async (req, res) => {
  try {
    const { chatName, wallpaper } = req.body;
    const update = {};
    if (chatName) update.chatName = chatName;
    if (wallpaper) update.wallpaper = wallpaper;

    const chat = await Chat.findByIdAndUpdate(req.params.id, update, {
      new: true,
    })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/chats/group/:id/add
// @desc   Add user to group
export const addToGroup = async (req, res) => {
  try {
    const { userId } = req.body;

    const chat = await Chat.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { users: userId } },
      { new: true }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/chats/group/:id/remove
// @desc   Remove user from group
export const removeFromGroup = async (req, res) => {
  try {
    const { userId } = req.body;

    const chat = await Chat.findByIdAndUpdate(
      req.params.id,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/chats/users
// @desc   Search users for creating chats
export const searchUsers = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } },
          ],
        }
      : {};

    const users = await User.find(keyword)
      .find({ _id: { $ne: req.user._id } })
      .select('-password')
      .limit(20);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
