import express from 'express';
import { getVideoData } from '../controllers/videoController.js';

const router = express.Router();

router.get('/', getVideoData);

export default router;
