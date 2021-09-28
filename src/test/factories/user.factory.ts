import { v4 as uuid } from 'uuid';
import { User } from '../../user/user.entity';

export const buildUser = (email = `${uuid()}@email.com`) => {
  const user = new User();
  user.id = uuid();
  user.email = email;
  return user;
};
