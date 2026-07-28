import jwt from 'jsonwebtoken';

// Verify customer JWT
export const authUser = (req, res, next) => {
  const token =
    req.cookies?.userToken || req.headers.authorization?.split(' ')[1];
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: 'Not authenticated' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Verify seller JWT
export const authSeller = (req, res, next) => {
  const token =
    req.cookies?.sellerToken || req.headers.authorization?.split(' ')[1];
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: 'Not authenticated' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isSeller)
      return res.status(403).json({ success: false, message: 'Not a seller' });
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
