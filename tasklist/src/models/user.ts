import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import bcrypt from 'bcryptjs';
import Task from './task';

const date = new Date();
const utc_offset = 180; // UTC Brasilia
date.setMinutes(date.getMinutes() - utc_offset);

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn('increment')
  @OneToMany(() => Task, (tasks) => tasks.userId)
  @JoinColumn({ name: 'userId' })
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password_hash: string;

  @Column({ default: date.toJSON() })
  created_at: string;

  @Column({ default: date.toJSON() })
  update_at: string;

  async checkPassword(password: string) {
    return await bcrypt.compare(password, this.password_hash);
  }
}
