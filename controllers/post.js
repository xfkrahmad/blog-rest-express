import Post from '../models/Post';
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    if (!posts.length) {
      return res.status(200).json({
        success: false,
        message: 'No Posts Found !',
        data: null,
      });
    }
    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(200).json({
        success: false,
        message: 'Please Provide Title And Description',
      });
    }
    const post = await Post.create({
      title,
      description,
      author: req.user.userId,
    });
    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error });
  }
};
export const getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(200).json({
        success: false,
        message: 'Post Not Found !',
        data: null,
      });
    }
    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(200).json({
        success: false,
        message: 'Post Not Found !',
        data: null,
      });
    }
    console.error(error);
    res.status(500).json({ success: false, error });
  }
};
export const editPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(200).json({
        success: false,
        message: 'Please Provide Title And Description',
      });
    }
    const post = await Post.findById(id);
    if (!post) {
      return res.status(200).json({
        success: false,
        message: 'Post Not Found !',
        data: null,
      });
    }

    if (post.author != req.user.userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized !',
      });
    }
    // update the post
    post.title = title;
    post.description = description;
    await post.save();

    res.status(200).json({
      success: true,
      message: `Post with ID : ${id} Updated Successfully`,
      data: post,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(200).json({
        success: false,
        message: 'Post Not Found !',
        data: null,
      });
    }
    console.error(error);
    res.status(500).json({ success: false, error });
  }
};

export const deletePostById = async (req, res) => {
  const { id } = req.params;
  try {
    // eslint-disable-next-line no-undef
    const post = await Post.findById(id);
    if (!post) {
      return res.status(200).json({
        success: false,
        message: 'Post Not Found !',
        data: null,
      });
    }

    if (post.author != req.user.userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized !',
      });
    }
    await post.remove();
    res.status(200).json({
      success: true,
      message: `Post with ID : ${id} Deleted Successfully`,
      data: post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error });
  }
};

export const getAllPostsByAuthorId = async (req, res) => {
  const { id } = req.params;
  try {
    const posts = await Post.find({ author: id });
    if (!posts.length) {
      return res.status(200).json({
        success: false,
        message: 'No Posts Found !',
        data: null,
      });
    }
    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error });
  }
};

export const likePostById = async (req, res) => {
  const { id } = req.params;
  try {
    let post = await Post.findById(id);
    if (!post) {
      return res.status(200).json({
        success: false,
        message: 'Post Not Found !',
        data: null,
      });
    }
    if (post.likes.includes(req.user.userId)) {
      await post.updateOne(
        { $pull: { likes: req.user.userId } },
        {},
        async function (err) {
          if (err) {
            console.error(err);
            return res.status(500).json({
              success: false,
              error: err,
            });
          } else {
            post = await Post.findById(id);
            return res.status(200).json({
              success: true,
              message: 'Unlike Post Successfull',
              data: post,
            });
          }
        }
      );
    }
    if (!post.likes.includes(req.user.userId)) {
      await post.updateOne(
        { $push: { likes: req.user.userId } },
        {},
        async function (err) {
          if (err) {
            console.error(err);
            return res.status(500).json({
              success: false,
              error: err,
            });
          } else {
            post = await Post.findById(id);
            return res.status(200).json({
              success: true,
              message: 'Like Post Successfull',
              data: post,
            });
          }
        }
      );
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error });
  }
};
