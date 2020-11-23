import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import * as Yup from 'yup';

import Task from '../models/task';
import User from './../models/user';

class TaskController {
  async store(req: Request, res: Response) {
    const schema = Yup.object().shape({
      task: Yup.string().required('Empty field.'),
    });

    const { task } = req.body;
    const { userId } = req;

    if (!(userId || task)) {
      return res.status(401).json({ error: 'Authentication error' });
    }

    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
      where: { id: userId },
    });

    const data = {
      task,
      userId: user,
    };
    await schema.validate(data, { abortEarly: false });

    const taskRepository = getRepository(Task);

    const createTask = taskRepository.create(data);
    await taskRepository.save(createTask);

    return res.json({
      id: createTask.id,
      user_id: createTask.userId,
      created_at: createTask.created_at,
      updated_at: createTask.update_at,
      task: createTask.task,
      check: createTask.check,
    });
  }
}

export default new TaskController();
