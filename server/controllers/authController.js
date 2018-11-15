import uuid from 'uuid/v4';
import userData from '../model/userData';

class AuthController {
  static signUpUser(req, res) {
    const userDetails = req.body;
    userDetails.userId = uuid();
    userDetails.isAdmin = false;
    userData.push(userDetails);
    res.status(200).json(userDetails);
  }

  static signInUser(req, res) {
    const { email, password } = req.body;
    const verifiedUser = userData.find(item => item.email === email && item.password === password);
    if (!verifiedUser) return res.status(401).json({ message: 'Invalid email or password' });
    res.status(200).json({ message: 'login successful' });
  }
}

export default AuthController;
