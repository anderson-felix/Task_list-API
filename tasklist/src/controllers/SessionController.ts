import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import jwt from 'jsonwebtoken';

import User from '../models/user';
import authConfig from '../config/auth';

class SessionController {
  async store(req: Request, res: Response) {
    const { email, password } = req.body;

    const userRepository = getRepository(User);

    const user = await userRepository.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not exists' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password incorrect' });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
