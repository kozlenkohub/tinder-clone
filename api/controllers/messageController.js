import Message from '../models/Message.js';

export const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const conversation = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user.id },
      ],
    }).sort('createdAt');
    res.status(200).json({
      message: 'Conversation fetched',
      data: conversation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
export const sendMessage = async (req, res) => {
  try {
    const { content, receiverId } = req.body;
    const newMessage = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      content,
    });
    res.status(201).json({
      message: 'Message sent',
      data: newMessage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
