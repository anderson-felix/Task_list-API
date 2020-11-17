import { Request, Response } from 'express';
import { getConnection, getRepository } from 'typeorm';
import * as Yup from 'yup';

import User from './../models/user';
import bcrypt from 'bcryptjs';

class UserController {
  async store(req: Request, res: Response) {
    const { name, email, password } = req.body;

    const userRepository = getRepository(User);

    const userExists = await userRepository.findOne({
      where: { email },
    });

    if (userExists) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const data = {
      name,
      email,
      password,
    };

    const schema = Yup.object().shape({
      name: Yup.string().required('Name Required'),
      email: Yup.string()
        .email('Email is not valid')
        .required('Email required'),
      password: Yup.string()
        .min(4, 'Password required 4 characters')
        .max(4, 'Password required 4 characters')
        .required('Password Required'),
    });

    await schema.validate(data, {
      abortEarly: false,
    });

    const password_hash = await bcrypt.hash(password, 10);

    const Hashdata = {
      name,
      email,
      password_hash,
    };

    const createUser = userRepository.create(Hashdata);

    await userRepository.save(createUser);

    return res.status(200).json({
      Sucess: 'User Created!',
      userName: createUser.name,
      userEmail: createUser.email,
      userId: createUser.userId,
    });
  }
  async update(req: Request, res: Response) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email('Not is email.'),
      password: Yup.string().min(4).max(4).required('Password Required!'),
      newPassword: Yup.string()
        .min(4)
        .max(4)
        .when('password', (password: string, field: any) => field),
      confirmPassword: Yup.string().when(
        'newPassword',
        (newPassword: string, field: any) =>
          newPassword
            ? field
                .required()
                .oneOf([Yup.ref('newPassword')], 'Password not confirmed.')
            : field
      ),
    });
    await schema.validate(req.body, {
      abortEarly: false,
    });

    const { name, email, password, newPassword } = req.body;

    const userRepository = getRepository(User);
    const user = await userRepository.findOne(req.userId);

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password incorrect' });
    }

    if (name) {
      await getConnection()
        .createQueryBuilder()
        .update(User)
        .set({
          name: name,
        })
        .where('id = :id', { id: req.userId })
        .execute();
    }

    if (email) {
      //SE O EMAIL DIGITADO FOR DIFERENTE DE QUEM ESTÁ LOGADO
      if (user.email !== email) {
        const userExists = await userRepository.findOne({
          where: { email },
        });

        //SE O EMAIL DIGITADO EXISTIR NO BANCO DE DADOS
        if (userExists) {
          return res.status(400).json({ error: 'User already exists' });
        }
      }

      await getConnection()
        .createQueryBuilder()
        .update(User)
        .set({
          email: email,
        })
        .where('id = :id', { id: req.userId })
        .execute();
    }
    if (newPassword) {
      const pNew = await bcrypt.hash(newPassword, 10);

      await getConnection()
        .createQueryBuilder()
        .update(User)
        .set({
          password_hash: pNew,
        })
        .where('id = :id', { id: req.userId })
        .execute();
    }

    return res.json({
      message: 'Updated sucessfully',
    });
  }
}

export default new UserController();
