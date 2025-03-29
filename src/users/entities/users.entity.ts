import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  birthdate: Date;

  @Column()
  phone: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column({ nullable: true, default: null })
  imgUser: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  roles: Role;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
