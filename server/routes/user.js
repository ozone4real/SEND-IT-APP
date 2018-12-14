import { Router } from 'express';
import { DataCreationValidator, DataUpdateValidator } from '../middlewares/dataValidator';
import UserController from '../controllers/userController';
import Auth from '../middlewares/auth';


const { userAuth } = Auth;
const {
  getAllUserOrders, signInUser, signUpUser, authUser, updatePhoneNo,
} = UserController;
const { userDataValidator } = DataCreationValidator;
const { validatePhoneNo } = DataUpdateValidator;


const user = Router();
const auth = Router();


user.get('/parcels', userAuth, getAllUserOrders);
user.get('/', userAuth, authUser);
user.put('/updatePhoneNo', [userAuth, validatePhoneNo], updatePhoneNo);

auth.post('/signup', userDataValidator, signUpUser);
auth.post('/signin', signInUser);

export { auth, user };
