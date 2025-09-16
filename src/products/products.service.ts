import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {CreateProductDto} from "./dto/create-product.dto";
import {UpdateProductDto} from "./dto/update-product.dto";

@Injectable()
export class ProductsService {

    constructor(private prisma: PrismaService) {}

    async create(createProductDto: CreateProductDto) {
        return this.prisma.product.create({
            data: {
                name: createProductDto.name,
                description: createProductDto.description,
                price: createProductDto.price,
                image: createProductDto.image,
                partner: {
                    connect: {id: createProductDto.partnerId},
                }
            }
        })
    }

    async findAll() {
        return this.prisma.product.findMany({
            include: {
                partner: {
                    select: {
                        id: true,
                        name: true,
                        kitchen: true,
                    }
                }
            }
        })
    }

    async findByPartner(partnerId: string) {
        return this.prisma.product.findMany({
            where: { partnerId },
            include: {
                partner: {
                    select: {
                        name: true,
                        kitchen: true,
                    },
                },
            },
        });
    }

    async findOne(id: string) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                partner: true,
                deliveryContents: true,
            },
        });

        if (!product) {
            throw new NotFoundException('Продукт не найден');
        }

        return product;
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        try {
            return await this.prisma.product.update({
                where: { id },
                data: updateProductDto,
            });
        } catch {
            throw new NotFoundException('Продукт не найден');
        }
    }

    async remove(id: string) {
        try {
            return await this.prisma.product.delete({
                where: { id },
            });
        } catch {
            throw new NotFoundException('Продукт не найден');
        }
    }
}
