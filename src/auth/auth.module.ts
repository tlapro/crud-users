import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/users.entity';
import { CloudinaryService } from 'src/common/cloudinary.service';
import { Role } from 'src/users/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  providers: [UsersService, CloudinaryService],
  controllers: [AuthController],
})
export class AuthModule {}
