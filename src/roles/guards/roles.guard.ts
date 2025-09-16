import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import {ROLES_KEY} from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<UserRole[]>(
            ROLES_KEY,
            context.getHandler(),
        );

        // Если роли не указаны - разрешаем доступ
        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Проверяем что пользователь есть и имеет нужную роль
        if (!user || !requiredRoles.includes(user.role)) {
            throw new ForbiddenException('Недостаточно прав');
        }

        return true;
    }
}