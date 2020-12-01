import { Request, Response } from 'express';
import { getConnection, getRepository } from 'typeorm';
import * as Yup from 'yup';

import Task from '../models/task';
import User from './../models/user';

class TaskController {
  async index(req: Request, res: Response) {
    const taskRepo = getRepository(Task);
    const userRepo = getRepository(User);

    const taskUser = await userRepo.findOne({
      where: { id: req.userId },
    });

    const tasks = await taskRepo.find({
      where: { userId: taskUser },
    });

    return res.json(tasks);
  }
  async store(req: Request, res: Response) {
    const schema = Yup.object().shape({
      task: Yup.string().required('Empty field.'),
    });

    const { task } = req.body;
    const { userId } = req;

    if (!(userId || task)) {
      return res.status(401).json({ error: 'Authentication error' });
    }

    const userRepo = getRepository(User);
    const user = await userRepo.findOne({
      where: { id: userId },
    });

    const data = {
      task,
      userId: user,
    };
    await schema.validate(data, { abortEarly: false });

    const taskRepo = getRepository(Task);

    const createTask = taskRepo.create(data);
    await taskRepo.save(createTask);

    return res.json({
      id: createTask.id,
      user_id: createTask.userId,
      created_at: createTask.created_at,
      updated_at: createTask.update_at,
      task: createTask.task,
      check: createTask.check,
    });
  }
  async update(req: Request, res: Response) {
    const { task_id } = req.params;
    const taskRepo = getRepository(Task);

    const taskId = parseInt(task_id);

    try {
      await getConnection()
        .createQueryBuilder()
        .update(Task)
        .set({
          check: req.body.check,
        })
        .where('id = :task_id', { task_id })
        .execute();
    } catch (e) {
      return res.json({ error: 'Task not exists', e });
    }
    const task = await taskRepo.findOneOrFail({
      where: { id: taskId },
    });
    return res.json(task);
  }
  async delete(req: Request, res: Response) {
    const { task_id } = req.params;
    const taskRepo = getRepository(Task);
    const taskId = parseInt(task_id);

    try {
      const task = await taskRepo.findOne({
        where: { id: taskId },
      });

      if (task.userId !== req.userId) {
        return res.status(401).json({ error: 'Not authorized' });
      }
    } catch (e) {
      return res.json({ error: 'Task not exists', e });
    }

    await taskRepo.delete({ id: taskId });
    return res.status(200).json({ message: 'Deleted' });
  }
}

export default new TaskController();
