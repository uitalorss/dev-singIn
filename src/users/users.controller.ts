import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  public async signup(@Body() { name, email, password }: createUserDto) {
    return await this.usersService.create({ name, email, password });
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  public async signin(@Body() { email, password }: LoginDto) {
    return await this.usersService.login({ email, password });
  }
}
