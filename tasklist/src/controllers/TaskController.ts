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

    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
      where: { id: userId },
    });

    const data = {
      task,
      userId: user,
    };
    await schema.validate(data, { abortEarly: false });

    if (!(userId || task)) {
      return res.status(401).json({ error: 'Authentication error' });
    }

    const taskRepository = getRepository(Task);

    const create = taskRepository.create(data);
    // await taskRepository.save(create);
    console.log(create);

    return res.json({
      id: create.id,
      user_id: create.userId,
      created_at: create.created_at,
      updated_at: create.update_at,
      task: create.task,
      check: create.check,
    });
  }
}

export default new TaskController();
