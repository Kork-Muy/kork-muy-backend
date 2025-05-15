import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async findOne(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findBySocialId(provider: string, id: string): Promise<User | null> {
    const query: Record<string, string> = {};
    query[`${provider}Id`] = id;
    return this.usersRepository.findOne({ where: query });
  }

  async create(userData: Partial<User>): Promise<User> {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async update(id: number, userData: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, userData);
    const user = await this.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}
