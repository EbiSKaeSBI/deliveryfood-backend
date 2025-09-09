import {Module} from "@nestjs/common";
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, UsersModule, PrismaModule],
  providers: [UsersService, PrismaService],
  controllers: [UsersController]
})
export class AppModule{}