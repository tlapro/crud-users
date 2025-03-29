import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { CloudinaryService } from 'src/common/cloudinary.service';
import { CloudinaryConfig } from 'src/config/cloudinary';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, CloudinaryConfig, CloudinaryService],
  controllers: [UsersController],
})
export class UsersModule {}
