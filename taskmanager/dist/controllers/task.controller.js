import prisma from '../lib/prisma.js';
// 1. Get All Tasks with Pagination, Filtering, and Searching
export const getTasks = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, search } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const tasks = await prisma.task.findMany({
            where: {
                userId: req.user.userId, // Sirf logged-in user ke tasks
                // Filtering by status
                status: status ? status : undefined,
                // Searching by title
                title: search ? { contains: String(search), mode: 'insensitive' } : undefined,
            },
            skip: Number(skip), // Pagination batching
            take: Number(limit),
            orderBy: { createdAt: 'desc' }
        });
        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({ error: "Tasks fetch nahi ho paye" });
    }
};
// 2. Create Task [cite: 24]
export const createTask = async (req, res) => {
    const { title, description } = req.body;
    if (!title)
        return res.status(400).json({ error: "Title is required" });
    const task = await prisma.task.create({
        data: {
            title,
            description,
            userId: req.user.userId
        }
    });
    res.status(201).json(task);
};
// 3. Toggle Task Status [cite: 25]
export const toggleTask = async (req, res) => {
    const { id } = req.params;
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task || task.userId !== req.user.userId) {
        return res.status(404).json({ error: "Task not found" });
    }
    const updatedTask = await prisma.task.update({
        where: { id },
        data: { status: task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED' }
    });
    res.json(updatedTask);
};
// 4. Delete Task [cite: 24]
export const deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.task.delete({ where: { id, userId: req.user.userId } });
        res.status(204).send();
    }
    catch (error) {
        res.status(404).json({ error: "Task delete nahi hua" });
    }
};
// 5. Update Task
export const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;
    try {
        const task = await prisma.task.findUnique({ where: { id } });
        if (!task || task.userId !== req.user.userId) {
            return res.status(404).json({ error: "Task not found or unauthorized" });
        }
        const updatedTask = await prisma.task.update({
            where: { id },
            data: {
                title: title ?? task.title,
                description: description ?? task.description,
                status: status ?? task.status,
            },
        });
        res.json(updatedTask);
    }
    catch (error) {
        res.status(500).json({ error: "Task update nahi ho paya" });
    }
};
export const getTaskById = async (req, res) => {
    const { id } = req.params;
    const task = await prisma.task.findUnique({
        where: { id, userId: req.user.userId },
    });
    if (!task)
        return res.status(404).json({ error: 'Task not found' });
    res.json(task);
};
//# sourceMappingURL=task.controller.js.map