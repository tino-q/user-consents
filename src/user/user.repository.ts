import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';

@EntityRepository(User)
export class UserCustomRepository extends Repository<User> {
  public async findOneById(id: string): Promise<User | null> {
    const user: User | undefined = await this.findOne(id);
    return user || null;
  }
}
