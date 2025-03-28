import { Controller, Delete, Get, Put } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @Put('update-data')
  updateUser() {
    return 'Este endpoint va a actualizar los datos de un usuario';
  }

  @Delete('delete-user')
  deleteUser() {
    return 'Este endpoint va a eliminar un usuario (inactivarlo)';
  }

  @Get(':id')
  getUserById() {
    return 'Este endpoint devolvera un usuario buscado por id.';
  }
}
