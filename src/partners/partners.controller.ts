import {Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards} from '@nestjs/common';
import {PartnersService} from "./partners.service";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {CreatePartnerDto} from "./dto/create-partner.dto";
import {UpdatePartnerDto} from './dto/update-partner.dto';
import {RolesGuard} from "../roles/guards/roles.guard";
import {Roles} from "../roles/decorators/roles.decorator";
import {UserRole} from "@prisma/client";
import {PaginationDto} from "../common/dto/pagination.dto";

@Controller('partners')
export class PartnersController {
    constructor(private partnerService: PartnersService) {}

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    create(@Body() createPartnerDto: CreatePartnerDto){
        return this.partnerService.create(createPartnerDto);
    }

    @Get()
    findAll(
        @Query() paginationDto: PaginationDto,
        @Query("search") search?: string){
        return this.partnerService.findAll({
            search,
            page: paginationDto.page,
            limit: paginationDto.limit,
        });
    }

    @Get(':id')
    findOne(@Param('id') id: string){
        return this.partnerService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    update(@Param('id') id: string, @Body() updatePartnerDto: UpdatePartnerDto) {
        return this.partnerService.update(id, updatePartnerDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    delete(@Param('id') id: string){
        return this.partnerService.delete(id);
    }
}
