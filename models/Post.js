import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Types.ObjectId, ref: 'Users' },
    title: {
      type: String,
      required: [true, 'Please provide the Title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide the Description'],
      trim: true,
    },
    likes: [{ type: mongoose.Types.ObjectId, ref: 'Users' }],
  },
  { timestamps: true, versionKey: false }
);

const Post = mongoose.model('Posts', PostSchema);
export default Post;
