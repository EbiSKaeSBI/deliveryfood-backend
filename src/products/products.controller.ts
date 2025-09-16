import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {ProductsService} from "./products.service";
import {JwtAuthGuard} from 'src/auth/guards/jwt-auth.guard';
import {CreateProductDto} from "./dto/create-product.dto";
import {UpdateProductDto} from "./dto/update-product.dto";
import {RolesGuard} from "../roles/guards/roles.guard";
import {Roles} from "../roles/decorators/roles.decorator";
import {UserRole} from "@prisma/client";

@Controller('products')
export class ProductsController {
    constructor(private readonly productService: ProductsService) {}


    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    create(@Body() createProductDto: CreateProductDto) {
        return this.productService.create(createProductDto);
    }

    @Get()
    findAll() {
        return this.productService.findAll();
    }

    @Get('partner/:partnerId')
    findByPartner(@Param('partnerId') partnerId: string) {
        return this.productService.findByPartner(partnerId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productService.update(id, updateProductDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    remove(@Param('id') id: string) {
        return this.productService.remove(id);
    }
}
