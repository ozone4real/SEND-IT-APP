import { Router } from 'express';
import { DataCreationValidator } from '../middlewares/dataValidator';
import UserController from '../controllers/userController';
import Auth from '../middlewares/auth';


const { userAuth } = Auth;
const {
  getAllUserOrders, signInUser, signUpUser, authUser
} = UserController;
const { userDataValidator } = DataCreationValidator;


const user = Router();
const auth = Router();


user.get('/parcels', userAuth, getAllUserOrders);
user.get('/', userAuth, authUser);

auth.post('/signup', userDataValidator, signUpUser);
auth.post('/signin', signInUser);

export { auth, user };
