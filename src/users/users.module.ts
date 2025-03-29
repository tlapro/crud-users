import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { CloudinaryService } from 'src/common/cloudinary.service';
import { CloudinaryConfig } from 'src/config/cloudinary';
import { Role } from './entities/role.entity';
import { SeedsService } from 'src/common/seed';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  providers: [UsersService, CloudinaryConfig, CloudinaryService, SeedsService],
  controllers: [UsersController],
})
export class UsersModule {}
