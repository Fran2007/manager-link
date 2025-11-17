import { Router } from 'express';
import { getLinks, getLink, createLink, updateLink, deleteLink } from '../controllers/link.controller.js';
import { authRequired } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/links', authRequired, getLinks);
router.get('/links/:id', authRequired, getLink);
router.post('/links', authRequired, createLink);
router.put('/links/:id', authRequired, updateLink);
router.delete('/links/:id', authRequired, deleteLink);

export default router;

