import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import {PrismaModule} from "../prisma/prisma.module";
import {RolesModule} from "../roles/roles.module";

@Module({
  imports: [PrismaModule, RolesModule],
  providers: [ProductsService],
  exports: [ProductsService],
  controllers: [ProductsController]
})
export class ProductsModule {}
