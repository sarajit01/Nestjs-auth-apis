import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DbService } from '../db/db.service';
import { Prisma } from 'src/generated/prisma/client';
import { HasherService } from '../hasher/hasher.service';

@Injectable()
export class UserService {
  constructor(
    private dbService: DbService,
    private hasher: HasherService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await this.hasher.hashPassword(
      createUserDto.password,
    );

    return await this.dbService.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
  }

  findAll() {
    return `This action returns all user`;
  }

  async findByUsername(username: string) {
    return await this.dbService.user.findUnique({
      where: {
        username,
      },
    });
  }

  async findOne(id: number) {
    return await this.dbService.user.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  // save the token
  async saveRefreshToken(userId: number, token: string) {
    // save token
    return await this.dbService.refreshToken.create({
      data: {
        user_id: userId,
        token: this.hasher.hashToken(token), // save the token in hashed format
        status: 'ACTIVE',
      },
    });
  }

  // update token
  async updateRefreshToken(userId: number, token: string, updatableTokenId) {
    return await this.dbService.refreshToken.update({
      data: {
        token: this.hasher.hashToken(token),
      },
      where: {
        id: updatableTokenId,
      },
    });
  }

  async getMatchedToken(userId: number, token: string) {
    console.log('Hashed by crypto', this.hasher.hashToken(token));

    return await this.dbService.refreshToken.findFirst({
      where: {
        user_id: userId,
        token: this.hasher.hashToken(token),
      },
    });
  }

  async deleteAllRefreshTokens(userId: number) {
    try {
      return await this.dbService.refreshToken.deleteMany({
        where: {
          user_id: userId,
        },
      });
    } catch {
      throw new InternalServerErrorException('Failed to delete refresh tokens');
    }
  }
}
