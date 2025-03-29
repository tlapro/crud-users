import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/UpdateUser.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/decorators/roles.decorator';
import { Rol } from 'src/common/roles.enum';
import { RolesGuard } from 'src/guards/role.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @Put('update-data/:id')
  @UseGuards(AuthGuard)
  updateUser(
    @Body() userNewData: UpdateUserDto,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.usersService.updateUser(userNewData, id);
  }

  @Put('delete-user/:id')
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deleteUser(id);
  }

  @Get(':id')
  @Roles(Rol.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getUserById(id);
  }

  @Put('changerol/:id')
  @Roles(Rol.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  changeRol(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.changeRol(id);
  }

  @Post('profile/image/:id')
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(AuthGuard)
  postImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.usersService.postImage(file, id);
  }

  @Get('/profile/:id')
  getUserProfile(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getUserProfile(id);
  }
}
