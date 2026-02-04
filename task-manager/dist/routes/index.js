import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import * as taskController from '../controllers/task.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
const router = Router();
// Auth Routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/refresh', authController.refresh);
router.post('/auth/logout', authController.logout);
// Task Routes (Protected by JWT)
router.use('/tasks', authenticateToken);
router.get('/tasks', taskController.getTasks);
router.post('/tasks', taskController.createTask);
router.get('/tasks/:id', taskController.getTaskById);
router.patch('/tasks/:id', taskController.updateTask);
router.delete('/tasks/:id', taskController.deleteTask);
router.patch('/tasks/:id/toggle', taskController.toggleTask);
export default router;
//# sourceMappingURL=index.js.map