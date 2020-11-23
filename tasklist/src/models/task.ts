import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import User from './user';

@Entity('tasks')
export default class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (users) => users.id)
  @JoinColumn({ name: 'userId' })
  userId: User;

  @CreateDateColumn({
    default:
      new Date().toDateString() + ' - ' + new Date().toLocaleTimeString(),
  })
  created_at: Date;

  @CreateDateColumn({
    default:
      new Date().toDateString() + ' - ' + new Date().toLocaleTimeString(),
  })
  update_at: Date;

  @Column({ default: false, nullable: false })
  check: boolean;

  @Column()
  task: string;
}
