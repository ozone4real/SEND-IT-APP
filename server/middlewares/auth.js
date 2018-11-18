import jwt from 'jsonwebtoken';

class Auth {
  static genAuth(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'Access denied, token not provided' });
    try {
      const decoded = jwt.verify(token, process.env.jwt_privateKey);
      req.user = decoded;
      next();
    }
    catch (error) {
      console.log(error);
      res.status(401).json({ message: 'Access denied, invalid token provided' });
    }
  }

  static adminAuth(req, res, next) {
    const { isAdmin } = req.user;
    if (!isAdmin) return res.status(403).json({ message: "Access denied, you don't have the required credentials to access this route" });
    next();
  }
}

export default Auth;
