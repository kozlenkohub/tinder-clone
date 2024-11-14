export const updateProfile = async (req, res) => {
  try {
    const { image, ...otherData } = req.body;
    let updatedDate = otherData;
    if (image) {
      //base 64 image
      if (image.startsWith('data:image')) {
        try {
          const uploadedResponse = await cloudinary.uploader.upload(image, {
            upload_preset: 'dev_setups',
          });
          updatedDate.avatar = {
            url: uploadedResponse.secure_url,
            public_id: uploadedResponse.public_id,
          };
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Server Error' });
        }
      }
    }
    const updatedUser = await User.findByIdAndUpdate(req.user._id, updatedDate, {
      new: true,
      runValidators: true,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
