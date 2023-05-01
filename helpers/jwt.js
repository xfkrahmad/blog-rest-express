import jwt from 'jsonwebtoken';
export const extractToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

export const authenticateJWT = (req, res, next) => {
  const token = extractToken(req);
  if (token) {
    try {
      const verifiedUser = jwt.verify(
        token,
        // eslint-disable-next-line no-undef
        process.env.JWT_ACCESS_TOKEN_SECRET
      );
      req.user = verifiedUser;
      next();
    } catch (error) {
      res.status(500).json({ success: false, error });
    }
  } else {
    res.status(401).json({ success: false, error: 'Unauthorized' });
  }
};
