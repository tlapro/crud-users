/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dtos/CreateUser.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dtos/LoginUser.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}
  getUsers() {
    return this.usersRepository.find();
  }
  comparePassword(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
  }
  async signUp(user: CreateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      const userDb = await this.usersRepository.findOne({
        where: { email: user.email },
      });
      // Checking if user already exists
      if (userDb) {
        throw new BadRequestException('El email ya se encuentra registrado.');
      }
      // Password comparison
      if (!this.comparePassword(user.password, user.confirmPassword)) {
        throw new BadRequestException('Las contraseñas no coinciden');
      }
      // Hashing password
      const hashedPassword: string = await bcrypt.hash(user.password, 10);
      if (!hashedPassword) {
        throw new BadRequestException(
          'Se generó un error al encriptar la contraseña',
        );
      }
      // Change password > hashedPassword
      const newUser = this.usersRepository.create({
        ...user,
        password: hashedPassword,
      });
      // Save user in database
      await queryRunner.manager.save(newUser);
      await queryRunner.commitTransaction();
      // Return only userWithoutPassword
      const {
        password: ignoredPassword,
        confirmPassword: ignoredConfirmPassword,
        ...userWithoutPassword
      } = user;
      return {
        message: 'Usuario registrado exitosamente',
        user: userWithoutPassword,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async signIn(credentials: LoginUserDto) {
    try {
      const user = await this.usersRepository.findOne({
        where: { email: credentials.email },
      });

      if (!user) {
        throw new BadRequestException(
          'No existe una cuenta asociada a ese email.',
        );
      }

      const isValid = await bcrypt.compare(
        credentials.password,
        user?.password,
      );

      if (!isValid) {
        throw new BadRequestException('Usuario o contraseña incorrectos.');
      }
      const userPayload = {
        sub: user.id,
        id: user.id,
        email: user.email,
        role: user.role,
      };
      const token = await this.jwtService.signAsync(userPayload);
      const { password: ignoredPassword, ...userWithoutPassword } = user;

      return { message: 'Login exitoso', user: userWithoutPassword, token };
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Ocurrió un error en el login.',
      );
    }
  }
}
