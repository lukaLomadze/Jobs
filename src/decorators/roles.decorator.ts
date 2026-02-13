import { SetMetadata } from '@nestjs/common';
import { Role } from '../enum/role.enum';
import { ROLES_KEY } from '../guards/roles.guard';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
