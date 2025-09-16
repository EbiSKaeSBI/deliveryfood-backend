import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {CreateDeliveryDto} from "./dto/create-deliveries.dto";
import {UpdateDeliveryDto} from "./dto/update-deliveries.dto";

@Injectable()
export class DeliveriesService {
    constructor(private prisma:PrismaService) {}

    async create(createDeliveryDto: CreateDeliveryDto) {
        const {contents, ...deliveriesData} = createDeliveryDto;

        return this.prisma.delivery.create({
            data: {
                ...deliveriesData,
                contents: {
                    create: contents.map(content => ({
                        productName: content.productName,
                        quantity: content.quantity,
                        price: content.price,
                        total: content.price * content.quantity,
                        product: content.productId ? {
                            connect: {id: content.productId}
                        } : undefined,
                    }))
                }
            },
            include: {
                contents: true,
                user: true,
                partner: true,
            }
        })
    }

    async findAll() {
        return this.prisma.delivery.findMany({
            include: {
                contents: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                partner: {
                    select: {
                        id: true,
                        name: true,
                        kitchen: true,
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            },
        })
    }

    async findByUser(userId: string) {
        return this.prisma.delivery.findMany({
            where: { userId },
            include: {
                contents: true,
                partner: true,
            },
            orderBy: {
                createdAt: "desc"
            }
        })
    }

    async findOne(id: string) {
        const delivery = await this.prisma.delivery.findUnique({
            where: { id },
            include: {
                contents: {
                    include: {
                        product: true,
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    }
                },
                partner: true,
            }
        })
        if (!delivery){
            throw new NotFoundException("Доставка не найдена")
        }
        return delivery
    }

    async update(id: string, updateDeliveryDto: UpdateDeliveryDto){

        const updateData = {
            status: updateDeliveryDto.status,
        }

        try {
            return await this.prisma.delivery.update({
                where: {id},
                data: updateData,
            })
        }catch {
            throw new NotFoundException("Доставка не найдена")
        }
    }

    async delete(id: string) {
        try {
            return await this.prisma.delivery.delete({
                where: {id}
            })
        } catch {
            throw new NotFoundException("Доставка не найдена")
        }
    }
}
