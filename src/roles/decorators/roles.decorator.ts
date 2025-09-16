import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export const ROLES_KEY = 'ADMIN';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);