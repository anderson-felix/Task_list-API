import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import bcrypt from 'bcryptjs';
import Task from './task';

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn()
  @OneToMany((type) => Task, (tasks) => tasks.user_id)
  id: Task;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password_hash: string;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  update_at: Date;

  async checkPassword(password: string) {
    return await bcrypt.compare(password, this.password_hash);
  }
}
