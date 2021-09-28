import { BadRequestException } from '@nestjs/common';
import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';

@EntityRepository(User)
export class UserCustomRepository extends Repository<User> {
  public async findOneById(id: string): Promise<User | null> {
    const user: User | undefined = await this.findOne(id);
    return user || null;
  }

  public async createUser(user: Omit<User, 'id'>): Promise<User | never> {
    try {
      return await this.save(user);
    } catch (error) {
      if (error.constraint === 'User_email_key') {
        throw new BadRequestException(400, 'Email already registered');
      }
      throw error;
    }
  }
}
