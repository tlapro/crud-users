import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/UpdateUser.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @Put('update-data/:id')
  updateUser(
    @Body() userNewData: UpdateUserDto,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.usersService.updateUser(userNewData, id);
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
