import express from 'express';
import {
  createPost,
  deletePostById,
  editPostById,
  getAllPosts,
  getAllPostsByAuthorId,
  getPostById,
  likePostById,
} from '../controllers/post';
import { authenticateJWT } from '../helpers/jwt';
const router = express.Router();

router.route('/').get(getAllPosts).post(authenticateJWT, createPost);
router.get('/author/:id', getAllPostsByAuthorId);
router
  .route('/:id')
  .get(getPostById)
  .patch(authenticateJWT, editPostById)
  .post(authenticateJWT, likePostById)
  .delete(authenticateJWT, deletePostById);
export default router;
