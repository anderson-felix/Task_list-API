import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import User from './user';

const date = new Date();
const utc_offset = 180; // UTC Brasilia
date.setMinutes(date.getMinutes() - utc_offset);

@Entity('tasks')
export default class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (users) => users.id)
  @JoinColumn({ name: 'userId' })
  userId: User;

  @Column({ default: date.toJSON() })
  created_at: string;

  @Column({ default: date.toJSON() })
  update_at: string;

  @Column({ default: false, nullable: false })
  check: boolean;

  @Column()
  task: string;
}
