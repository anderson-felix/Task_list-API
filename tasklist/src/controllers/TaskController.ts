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

    const userRepository = getRepository(User);
    req.userId = userRepository.findOne({
      where: { id: req.userId },
    });

    const data = {
      task,
    };

    await schema.validate(data, { abortEarly: false });

    const taskRepository = getRepository(Task);

    const create = taskRepository.create(data);
    await taskRepository.save(create);

    return res.json({
      id: create.id,
      user_id: create.user_id,
      created_at: create.created_at,
      updated_at: create.update_at,
      task: create.task,
      check: create.check,
    });
  }
}

export default new TaskController();
