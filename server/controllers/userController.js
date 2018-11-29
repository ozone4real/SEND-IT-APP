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
      fullname,
      email,
      phoneNo,
      password,
    } = req.body;

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const { rows } = await db(`INSERT into users (userId, fullname, email, phoneNo, password)
       values ($1, $2, $3, $4, $5) RETURNING *`,
      [uuid(), fullname, email, phoneNo, hashedPassword]);
      const token = signToken(rows);
      const { html, subject } = signUpMail(fullname);
      mailer(subject, html, email);
      return res.status(201).json({ token, user: rows[0] });
    } catch (error) {
      if (error.detail.match(/email/i)) return res.status(409).json({ message: 'Email already taken' });
      console.log(error);
      return next();
    }
  }

  /**
   * @description Signs up an admin
   * @static
   * @param {object} req Request Object
   * @param {object} res Response Object
   * @param {object} next passes control to the next middleware/handler.
   */
  static async signUpAdmin(req, res, next) {
    const {
      fullname,
      email,
      phoneNo,
      password,
    } = req.body;

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const { rows } = await db('INSERT into users (userId, fullname, email, phoneNo, password, isAdmin) values ($1, $2, $3, $4, $5, $6) RETURNING *', [uuid(), fullname, email, phoneNo, hashedPassword, true]);
      const token = signToken(rows);
      console.log(token);
      return res.status(201).json({ token, user: rows[0] });
    } catch (error) {
      if (error.detail.match(/email/i)) return res.status(409).json({ message: 'Email already taken' });
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
        return res.status(401)
          .json({ message: 'Invalid Email or Password' });
      }

      const validPassword = await bcrypt.compare(password, rows[0].password);

      if (!validPassword) return res.status(401).json({ message: 'Invalid Email or Password' });

      const token = signToken(rows);
      res.status(200)
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

  /**
   * @description fetches all user parcel delivery orders
   * @static
   * @param {object} req Request Object
   * @param {object} res Response Object
   * @param {object} next passes control to the next middleware/handler
   */
  static async getAllUserOrders(req, res, next) {
    const { userId } = req.params;
    if (req.user.userId !== userId) {
      return res.status(403)
        .json({ message: 'Access denied. You are forbidden from accessing this route.' });
    }
    try {
      const { rows } = await db('SELECT * FROM parcelOrders WHERE userId = $1', [userId]);
      if (!rows[0]) return res.status(404).json({ message: 'No orders found for user' });
      return res.status(200).json(rows);
    } catch (error) {
      console.log(error);
      return next();
    }
  }
}

export default UserController;
