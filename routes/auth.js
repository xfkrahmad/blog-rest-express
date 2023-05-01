import express from 'express';
import {
  loginHandler,
  refreshTokenHandler,
  registerHandler,
} from '../controllers/auth';
const router = express.Router();

router.route('/login').post(loginHandler);
router.route('/register').post(registerHandler);
router.route('/refresh').get(refreshTokenHandler);

export default router;
