import { Body, Controller, Post } from '@nestjs/common';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}
  @Post('signup')
  signUp(@Body() user: User) {
    return this.usersService.signUp(user);
  }

  @Post('signin')
  signIn() {}
}
