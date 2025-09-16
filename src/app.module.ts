import {Module} from "@nestjs/common";
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { DeliveriesService } from './deliveries/deliveries.service';
import { DeliveriesController } from './deliveries/deliveries.controller';
import { DeliveriesModule } from './deliveries/deliveries.module';
import {ProductsController} from "./products/products.controller";
import {ProductsService} from "./products/products.service";
import {PartnersService} from "./partners/partners.service";
import {PartnersController} from "./partners/partners.controller";

@Module({
  imports: [AuthModule, UsersModule, PrismaModule, ProductsModule, DeliveriesModule, ProductsModule],
  providers: [UsersService, PrismaService, DeliveriesService,ProductsService,PartnersService],
  controllers: [UsersController, DeliveriesController,ProductsController,PartnersController]
})
export class AppModule{}