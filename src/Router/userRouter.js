import express from 'express';
import { addUserData, sendFileToUser } from '../controller/userController.js';


const router = express.Router();

router.get('/', sendFileToUser)
// router.post('/add_user', addUserData);

export default router;