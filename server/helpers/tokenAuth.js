import jwt from 'jsonwebtoken';

/**
 * @description signing and verification of token
 * @class Token
 */
class Token {
  /**
   * @description signs the json web token
   * @static
   * @param {Object} result Response of the database query
   * @returns a token signed with the user's id and role
   */
  static signToken(rows) {
    return jwt.sign({
      userId: rows[0].userid,
      isAdmin: rows[0].isadmin,
    }, process.env.jwt_privateKey);
  }

  /**
   * @description It verifies a token
   * @static
   * @param {String} token Token to be verified
   * @returns a boolean value
   */
  static verifyToken(token) {
    return jwt.verify(token, process.env.jwt_privateKey);
  }
}

export default Token;
