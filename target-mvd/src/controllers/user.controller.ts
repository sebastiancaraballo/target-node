import { repository } from '@loopback/repository';
import { post, param, get, requestBody, HttpErrors } from '@loopback/rest';
import { User } from '../models';
import { UserRepository } from '../repositories';
import { hash } from 'bcryptjs';
import { promisify } from 'util';
import * as isemail from 'isemail';

const hashAsync = promisify(hash);


export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) { }

  @post('/users')
  async create(@requestBody() user: User): Promise<User> {
    if (!isemail.validate(user.email)) {
      throw new HttpErrors.UnprocessableEntity('invalid email');
    }

    if (user.password.length < 8) {
      throw new HttpErrors.UnprocessableEntity(
        'password must be minimum 8 characters',
      );
    }

    user.password = await hashAsync(user.password, 10);

    const savedUser = await this.userRepository.create(user);
    delete savedUser.password;
    return savedUser;
  }

  @get('/users/{id}')
  async findById(@param.path.string('id') id: string): Promise<User> {
    const user = await this.userRepository.findById(id, {
      fields: { password: false },
    });
    return user;
  }
}
