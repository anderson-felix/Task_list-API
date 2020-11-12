import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

import User from './user';

@Entity('tasks')
export default class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (users) => users.id)
  user_id: User;

  @Column()
  task: string;

  @Column()
  check: boolean;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  update_at: Date;
}
