import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}
  getUsers() {
    return this.usersRepository.find();
  }
  signUp(user: Omit<User, 'id'>) {
    return this.usersRepository.save(user);
  }
}
