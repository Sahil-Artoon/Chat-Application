import express from 'express';
import { getUserData, sendFileToUser } from '../controller/userController.js';


const router = express.Router();

router.get('/', sendFileToUser)
router.post('/add_user', getUserData);

export default router;