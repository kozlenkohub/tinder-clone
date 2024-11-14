import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female'],
    },
    genderPreference: {
      type: String,
      required: true,
      enum: ['male', 'female', 'both'],
    },
    bio: { type: String, default: '' },
    image: { type: String, default: '' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
  }
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

const User = mongoose.model('User', userSchema);

export default User;
