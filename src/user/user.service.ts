import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './user.dto';
import { User } from './user.entity';
import { UserCustomRepository } from './user.repository';

@Injectable()
export class UserService {
  public constructor(private userRepository: UserCustomRepository) {}

  public create(user: CreateUserDto): Promise<User | never> {
    return this.userRepository.createUser(user);
  }

  public async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  public findOneById(id: string): Promise<User | null> {
    return this.userRepository.findOneById(id);
  }
}
