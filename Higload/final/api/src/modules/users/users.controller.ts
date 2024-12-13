import { Crud, CrudController } from '@dataui/crud';
import { Controller } from '@nestjs/common';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Crud({
  model: {
    type: User,
  },
})
@Controller('users')
export class UsersController implements CrudController<User> {
  constructor(public service: UsersService) {}
}
