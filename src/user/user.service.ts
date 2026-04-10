import { Injectable } from '@nestjs/common';
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
}
