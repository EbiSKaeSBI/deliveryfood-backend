import { Module } from '@nestjs/common';
import {PrismaModule} from "../prisma/prisma.module";
import {PartnersController} from "./partners.controller";
import {PartnersService} from "./partners.service";
import {RolesModule} from "../roles/roles.module";

@Module({
    imports: [PrismaModule, RolesModule],
    controllers: [PartnersController],
    providers: [PartnersService],
    exports: [PartnersService],
})
export class PartnersModule {}
