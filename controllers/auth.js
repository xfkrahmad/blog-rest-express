import { comparePassword, hashPassword } from '../helpers/bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const loginHandler = async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: 'Please Provide Email And Password' });
  }

  try {
    // check if the user with email exist

    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(401).json({
        success: false,
        message: 'Wrong credentials please check again!',
      });
    }
    //check if the password is correct
    const correctPassword = await comparePassword(
      password,
      userExists.password
    );
    if (!correctPassword) {
      return res.status(401).json({
        success: false,
        message: 'Wrong credentials please check again!',
      });
    }
    const accessToken = jwt.sign(
      { userId: userExists._id, email: userExists.email },
      // eslint-disable-next-line no-undef
      process.env.JWT_ACCESS_TOKEN_SECRET,
      {
        expiresIn: '5m',
      }
    );
    const refreshToken = jwt.sign(
      { userId: userExists._id },
      // eslint-disable-next-line no-undef
      process.env.JWT_REFRESH_TOKEN_SECRET,
      {
        expiresIn: '1h',
      }
    );
    userExists.refreshToken = refreshToken;
    await userExists.save();
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });
    res.status(200).json({
      success: true,
      message: 'Login Successfully',
      data: {
        userId: userExists._id,
        email: userExists.email,
        accessToken: accessToken,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error });
  }
};

export const registerHandler = async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: 'Please Provide Email And Password' });
  }
  try {
    // check if the user with email exist
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res
        .status(400)
        .json({ success: false, message: 'Email already exists' });
    }
    // hash the password and insert the new user
    const hashedPassword = await hashPassword(password);
    const user = await User.create({ email, password: hashedPassword });

    res.status(201).json({
      success: true,
      message: 'Your account has been created successfully',
      data: {
        userId: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error });
  }
};

export const refreshTokenHandler = async (req, res) => {
  const { cookies } = req;
  if (!cookies || !cookies.jwt) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized !',
    });
  }
  try {
    const refreshToken = cookies.jwt;
    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(403).json({
        success: false,
        message: 'Cookies are not valid !',
      });
    }
    jwt.verify(
      refreshToken,
      // eslint-disable-next-line no-undef
      process.env.JWT_REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || !decoded) {
          return res.status(403).json({
            success: false,
            message: err,
          });
        }
        const accessToken = jwt.sign(
          { userId: user._id, email: user.email },
          // eslint-disable-next-line no-undef
          process.env.JWT_ACCESS_TOKEN_SECRET
        );
        res.status(200).json({
          success: true,
          message: 'Refresh Token Successfull',
          data: {
            userId: user._id,
            email: user.email,
            accessToken: accessToken,
          },
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error });
  }
};
