import { Router } from 'express';
import { getFolders, getFolder, createFolder, updateFolder, deleteFolder } from '../controllers/folder.controller.js';
import { authRequired } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/folders', authRequired, getFolders);
router.get('/folders/:id', authRequired, getFolder);
router.post('/folders', authRequired, createFolder);
router.put('/folders/:id', authRequired, updateFolder);
router.delete('/folders/:id', authRequired, deleteFolder);

export default router;

