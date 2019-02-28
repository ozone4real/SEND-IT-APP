import 'babel-polyfill';
import bcrypt from 'bcrypt';
import uuid from 'uuid/v4';
import TokenAuth from '../helpers/tokenAuth';
import db from '../db/connection';
import mailer from '../helpers/mailer';
import messages from '../helpers/mailMessages';

const { signUpMail } = messages;

const { signToken } = TokenAuth;

/**
 * @description Represents a collection of route handlers pertaining to the user
 * @class UserController
 */
class UserController {
  /**
   * @description Signs up a user
   * @static
   * @param {object} req Request Object
   * @param {object} res Response Object
   * @param {object} next passes control to the next middleware/handler
   */
  static async signUpUser(req, res, next) {
    const {
      fullname, email, phoneNo, password
    } = req.body;

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const { rows } = await db(
        `INSERT into users (userId, fullname, email, phoneNo, password)
       values ($1, $2, $3, $4, $5) RETURNING *`,
        [uuid(), fullname, email, phoneNo, hashedPassword]
      );
      const token = signToken(rows);
      const { html, subject } = signUpMail(fullname);
      mailer(subject, html, email);
      delete rows[0].password;
      return res.status(201).json({ token, user: rows[0] });
    } catch (error) {
      if (error.detail.match(/email/i)) {
        return res.status(409).json({ message: 'Email already taken' });
      }
      console.log(error);
      return next();
    }
  }

  /**
   * @description Signs in a user
   * @static
   * @param {object} req Request Object
   * @param {object} res Response Object
   * @param {Function} next passes control to the next middleware/handler
   * @returns a response object and status code
   */
  static async signInUser(req, res, next) {
    const { email, password } = req.body;
    try {
      const { rows } = await db('SELECT * FROM users where email = ($1)', [email]);
      if (!rows[0]) {
        return res.status(401).json({ message: 'Invalid Email or Password' });
      }

      const validPassword = await bcrypt.compare(password, rows[0].password);

      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid Email or Password' });
      }
      const token = signToken(rows);
      delete rows[0].password;
      res
        .status(200)
        .header('x-auth-token', token)
        .json({
          token,
          user: rows[0],
          message: `Welcome ${rows[0].fullname}`
        });
    } catch (err) {
      console.log(err);
      return next();
    }
  }

  static async authUser(req, res, next) {
    const { userId } = req.user;
    try {
      const { rows } = await db('SELECT * FROM users WHERE userId = $1', [userId]);
      if (!rows[0]) return res.status(404).json({ message: 'User not found' });
      delete rows[0].password;
      delete rows[0].userid;
      return res.status(200).json(rows[0]);
    } catch (error) {
      console.log(error);
      return next();
    }
  }

  /**
   * @description fetches all user parcel delivery orders
   * @static
   * @param {object} req Request Object
   * @param {object} res Response Object
   * @param {object} next passes control to the next middleware/handler
   */
  static async getAllUserOrders(req, res, next) {
    const { userId } = req.user;
    try {
      const { rows } = await db('SELECT * FROM parcelOrders WHERE userId = $1', [userId]);
      if (!rows[0]) {
        return res.status(404).json({ message: 'No orders found for user' });
      }
      return res.status(200).json(rows);
    } catch (error) {
      console.log(error);
      return next();
    }
  }

  /**
   * @description updates a user's phone number
   * @static
   * @param {object} req Request Object
   * @param {object} res Response Object
   * @param {object} next passes control to the next middleware/handler
   */
  static async updatePhoneNo(req, res, next) {
    const { userId } = req.user;
    const { phoneNo } = req.body;
    try {
      const { rows } = await db('UPDATE users SET phoneNo = $1 WHERE userId = $2 RETURNING *', [
        phoneNo,
        userId
      ]);
      return res.status(200).json(rows);
    } catch (error) {
      console.log(error);
      return next();
    }
  }
}

export default UserController;
