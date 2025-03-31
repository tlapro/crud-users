/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
  UnauthorizedException,
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
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateUserAdminDto } from './dtos/UpdateUserAdmin.dto';
import { UpdateUserPassword } from './dtos/UpdateUserPassword..dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  // @Roles(Rol.Admin)
  // @UseGuards(AuthGuard, RolesGuard)
  getUsers() {
    return this.usersService.getUsers();
  }

  @ApiBearerAuth()
  @Put('changue-password/:id')
  @UseGuards(AuthGuard)
  changePassword(
    @Req() req,
    @Body() userUpdatePassword: UpdateUserPassword,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    if (req.user.id !== id) {
      throw new UnauthorizedException(
        'No tienes permiso para actualizar los datos de otro usuario.',
      );
    }
    return this.usersService.changePassword(userUpdatePassword, id);
  }

  @ApiBearerAuth()
  @Put('update-data/:id')
  @UseGuards(AuthGuard)
  updateUser(
    @Req() req,
    @Body() userNewData: UpdateUserDto,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    if (req.user.id !== id) {
      throw new UnauthorizedException(
        'No tienes permiso para actualizar los datos de otro usuario.',
      );
    }
    return this.usersService.updateUser(userNewData, id);
  }

  @ApiBearerAuth()
  @Put('update-admin/:id')
  @Roles(Rol.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  updateAdmin(
    @Body() userNewData: UpdateUserAdminDto,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.usersService.updateAdmin(userNewData, id);
  }

  @ApiBearerAuth()
  @Put('delete-user/:id')
  @UseGuards(AuthGuard)
  deleteUser(@Req() req, @Param('id', ParseUUIDPipe) id: string) {
    if (req.user.id !== id) {
      throw new UnauthorizedException(
        'No tienes permiso para eliminar a otro usuario.',
      );
    }
    return this.usersService.deleteUser(id);
  }

  @ApiBearerAuth()
  @Put('delete-admin/:id')
  @Roles(Rol.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  deleteUserAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deleteUserAdmin(id);
  }

  @ApiBearerAuth()
  @Put('active-admin/:id')
  @Roles(Rol.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  activeUserAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.activeUserAdmin(id);
  }

  @ApiBearerAuth()
  @Delete('delete-dbuser/:id')
  @Roles(Rol.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  deleteDbUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deleteDbUser(id);
  }

  @ApiBearerAuth()
  @Get(':id')
  @Roles(Rol.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getUserById(id);
  }

  @ApiBearerAuth()
  @Put('changerol/:id')
  @Roles(Rol.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  changeRol(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.changeRol(id);
  }

  @ApiBearerAuth()
  @Post('profile/image/:id')
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(AuthGuard)
  postImage(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    if (req.user.id !== id) {
      throw new UnauthorizedException(
        'No tienes permiso para subir una imagen de perfil a otro usuario.',
      );
    }
    return this.usersService.postImage(file, id);
  }

  @ApiBearerAuth()
  @Put('profile/deleteimage/:id')
  @UseGuards(AuthGuard)
  putImage(@Req() req, @Param('id', ParseUUIDPipe) id: string) {
    if (req.user.id !== id) {
      throw new UnauthorizedException(
        'No tienes permiso para eliminar la imagen de otro usuario.',
      );
    }
    return this.usersService.putImage(id);
  }

  @Get('/profile/:id')
  @UseGuards(AuthGuard)
  getUserProfile(@Req() req, @Param('id', ParseUUIDPipe) id: string) {
    if (req.user.id !== id) {
      throw new UnauthorizedException(
        'No tienes permiso para acceder a los datos de perfil de otro usuario.',
      );
    }
    return this.usersService.getUserProfile(id);
  }
}
