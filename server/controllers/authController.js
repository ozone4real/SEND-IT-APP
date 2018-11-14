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
}

export default AuthController;
