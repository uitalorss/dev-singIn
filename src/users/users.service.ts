import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { User } from './models/users.model';
import { createUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User')
    private readonly usersModel: Model<User>,
    private readonly authService: AuthService,
  ) {}

  public async create({ name, email, password }: createUserDto) {
    const user = new this.usersModel({ name, email, password });
    return user.save();
  }

  public async login({
    email,
    password,
  }: LoginDto): Promise<{ name: string; jwtToken: string; email: string }> {
    const user = await this.findByEmail(email);
    const match = this.verifyPassword(password, user.password);
    if (!match) {
      throw new UnauthorizedException('Usuário e/ou senha incorretos.');
    }
    const jwtToken = await this.authService.createAccessToken(user.id);
    return { name: user.name, jwtToken, email: user.email };
  }

  private async findByEmail(email: string): Promise<User> {
    const user = await this.usersModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Usuário e/ou senha incorretos.');
    }
    return user;
  }

  private async verifyPassword(password: string, hashedPassword: string) {
    const match = await bcrypt.compare(password, hashedPassword);

    return match;
  }
}
