import TokenAuth from '../helpers/tokenAuth';

const { verifyToken } = TokenAuth;

/**
 * @description Represents authentication of user/admin
 * @class Auth
 */
class Auth {
  /**
   * @description authenticates a User
   * @static
   * @param {object} req Request Object
   * @param {object} res Response Object
   * @param {object} next passes control to the next middleware/handler
   * @returns a response object and status code
   */
  static userAuth(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'Access denied, token not provided' });
    try {
      const decoded = verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      console.log(error);
      if (error.message.match(/key/i)) {
        return res.status(500).send('Internal server error. Something bad happened');
      }
      res.status(401)
        .json({ message: 'Access denied, invalid token provided' });
    }
  }

  /**
   * @description authenticates an Admin
   * @static
   * @param {object} req Request Object
   * @param {object} res Response Object
   * @param {object} next passes control to the next middleware/handler
   * @returns a response object and status code
   */
  static adminAuth(req, res, next) {
    const { isAdmin } = req.user;
    if (!isAdmin) {
      return res.status(403)
        .json({
          message: "Access denied, you don't have the required credentials to access this route"
        });
    }
    next();
  }
}

export default Auth;
