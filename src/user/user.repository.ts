import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';

@EntityRepository(User)
export class UserCustomRepository extends Repository<User> {
  public findOneById(id: string): Promise<User | null> {
    return this.findOne(id);
  }
}
