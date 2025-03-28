import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}
  @Post('signup')
  signUp(@Body() user: CreateUserDto) {
    return this.usersService.signUp(user);
  }

  @Post('signin')
  signIn() {}
}
