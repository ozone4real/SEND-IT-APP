import 'babel-polyfill';
import bcrypt from 'bcrypt';
import uuid from 'uuid/v4';
import jwt from 'jsonwebtoken';
import db from '../db/connection';


class AuthController {
  static async signUpUser(req, res) {
    const {
      fullname, email, phoneNo, password,
    } = req.body;

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const result = await db.query('INSERT into users (userId, fullname, email, phoneNo, password) values ($1, $2, $3, $4, $5) RETURNING *', [uuid(), fullname, email, phoneNo, hashedPassword]);
      const token = jwt.sign({ userId: result.rows[0].userid, isAdmin: result.rows[0].isadmin }, process.env.jwt_privateKey);
      res.status(201).header('x-auth-token', token).json(result.rows[0]);
    }
    catch (error) {
      if (error.detail.match(/email/i)) res.status(409).json({ message: 'Email already taken' });
      console.log(error);
    }
  }

  static async signInUser(req, res) {
    const { email, password } = req.body;
    try {
      const result = await db.query('SELECT * FROM users where email = ($1)', [email]);
      if (!result.rows[0]) return res.status(401).json({ message: 'Invalid Email or Password' });
      const validPassword = await bcrypt.compare(password, result.rows[0].password);
      if (!validPassword) return res.status(401).json({ message: 'Invalid Email or Password' });
      const token = jwt.sign({ userId: result.rows[0].userid, isAdmin: result.rows[0].isadmin }, process.env.jwt_privateKey);
      res.status(200).header('x-auth-token', token).json({ message: `Welcome ${result.rows[0].fullname}` });
    }
    catch (err) {
      console.log(err);
    }
  }
}

export default AuthController;
