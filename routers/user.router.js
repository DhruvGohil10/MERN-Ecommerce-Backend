import express from 'express'
const router = express.Router();
import {getUsers,addUser,addUsers, getUser, deleteUser, updateUser, signUp, signIn, resetPassword} from './../controllers/user.controller'

router.get('/get-users', getUsers);
router.get('/get-user/:id', getUser);
router.post('/add-user', addUser);
router.post('/add-users', addUsers);


router.delete('/delete-user/:id', deleteUser);

router.patch('/update-user/:id', updateUser);
router.patch('/reset-password', resetPassword);


router.post('/sign-up', signUp);
router.post('/sign-in', signIn);

export default router