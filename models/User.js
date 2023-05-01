import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Please provide the Email'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide the Password'],
      trim: true,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false }
);

const User = mongoose.model('Users', UserSchema);
export default User;
