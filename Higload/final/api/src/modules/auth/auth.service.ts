import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './jwt-payload.interface';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(userDto: RegisterDto): Promise<any> {
    const { username, email, password, first_name, last_name } = userDto;

    const existingUser = await this.usersRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: User = this.usersRepository.create({
      username,
      email,
      password: hashedPassword,
      first_name,
      last_name,
    });

    await this.usersRepository.save(newUser);

    return newUser;
  }

  async login(dto: LoginDto) {
    const { username, password } = dto;

    const user = await this.usersRepository.findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid username or password');
    }

    const payload: JwtPayload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }
}
