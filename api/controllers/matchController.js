import User from '../models/User.js';

const handleErrorResponse = (res, error) => {
  console.error(error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};

export const swipeRight = async (req, res) => {
  try {
    const { likedUserId } = req.params;
    const currentUser = await User.findById(req.user._id);
    const likedUser = await User.findById(likedUserId);

    if (!likedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!currentUser.likes.includes(likedUserId)) {
      currentUser.likes.push(likedUserId);
      await currentUser.save();

      if (likedUser.likes.includes(currentUser.id)) {
        currentUser.matches.push(likedUserId);
        likedUser.matches.push(currentUser.id);
        await Promise.all([currentUser.save(), likedUser.save()]);
      }
    }

    res.status(200).json({
      success: true,
      message: 'User liked',
    });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const swipeLeft = async (req, res) => {
  try {
    const { dislikedUserId } = req.params;
    const currentUser = await User.findById(req.user._id);

    if (!currentUser.dislikes.includes(dislikedUserId)) {
      currentUser.dislikes.push(dislikedUserId);
      await currentUser.save();
    }
    res.status(200).json({
      success: true,
      message: 'User disliked',
    });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const getMatches = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('matches', 'name image');
    res.status(200).json({
      success: true,
      matches: user.matches,
    });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const getUserProfiles = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const users = await User.find({
      _id: {
        $nin: [
          ...currentUser.likes,
          ...currentUser.dislikes,
          ...currentUser.matches,
          currentUser.id,
        ],
      },
      gender:
        currentUser.genderPreference === 'both'
          ? { $in: ['male', 'female'] }
          : currentUser.genderPreference,
      genderPreference: { $in: [currentUser.gender, 'both'] },
    });
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};
