import { json } from 'express';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import User from './user';

@Entity('tasks')
export default class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (users) => users.id)
  @JoinColumn({ name: 'userId' })
  userId: User;

  @CreateDateColumn({ default: new Date().toLocaleString() })
  created_at: string;

  @UpdateDateColumn({ default: new Date().toLocaleString() })
  update_at: string;

  @Column({ default: false, nullable: false })
  check: boolean;

  @Column()
  task: string;
}
