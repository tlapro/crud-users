import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/users.entity';
import { CloudinaryService } from 'src/common/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, CloudinaryService],
  controllers: [AuthController],
})
export class AuthModule {}
