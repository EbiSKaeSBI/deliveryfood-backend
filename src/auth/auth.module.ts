import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {PrismaModule} from "../prisma/prisma.module";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {JwtStrategy} from "./strategies/jwt.strategy";
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [
      ConfigModule.forRoot({
          isGlobal: true,
      }),
      PrismaModule,
      PassportModule,
      JwtModule.register({
        secret:process.env.JWT_ACCESS_SECRET,
        signOptions: {expiresIn: '15m'},
      })

  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
