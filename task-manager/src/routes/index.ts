import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import * as taskController from '../controllers/task.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();

// =======================
// 1. PUBLIC ROUTES (No Token Needed)
// =======================
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);


// =======================
// 2. PROTECTED ROUTES (Token Required)
// =======================

// Hum ek temporary 'taskRouter' banayenge
const taskRouter = Router();

// Is 'taskRouter' pe aane wali har request pe Token check hoga
taskRouter.use(authenticateToken); 

// Note: Yahan ab '/tasks' likhne ki zaroorat nahi, kyunki hum neeche mount karenge
taskRouter.get('/', taskController.getTasks);       // GET /api/tasks
taskRouter.post('/', taskController.createTask);      // POST /api/tasks
taskRouter.get('/:id', taskController.getTaskById);   // GET /api/tasks/:id
taskRouter.patch('/:id', taskController.updateTask);  // PATCH /api/tasks/:id
taskRouter.delete('/:id', taskController.deleteTask); // DELETE /api/tasks/:id
taskRouter.patch('/:id/toggle', taskController.toggleTask);

// Ab is taskRouter ko main router se jod do
router.use('/tasks', taskRouter);

export default router;