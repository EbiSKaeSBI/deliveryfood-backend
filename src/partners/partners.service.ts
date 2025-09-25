import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {CreatePartnerDto} from "./dto/create-partner.dto";
import {UpdatePartnerDto} from "./dto/update-partner.dto";

@Injectable()
export class PartnersService {

    constructor(private prisma: PrismaService) {}

    async create(createPartnerDto: CreatePartnerDto){
        return this.prisma.partner.create({
            data: {
                name: createPartnerDto.name,
                timeOfDelivery: createPartnerDto.timeOfDelivery,
                stars: createPartnerDto.stars,
                minPrice: createPartnerDto.minPrice,
                kitchen: createPartnerDto.kitchen,
                image: createPartnerDto.image,
            },
        });
    }

    async findAll(search?:string){
        return this.prisma.partner.findMany({
        where: search ? {
            OR: [
                {
                    name: {
                        contains: search,
                        mode: "insensitive"
                    }
                }
            ]
            } : undefined,
            include: {
                products: true,
                deliveries: true,
            },
        });
    }

    async findOne(id: string){
        const partner = await this.prisma.partner.findUnique({
            where: { id },
            include: {
                products: true,
                deliveries: {
                    include: {
                        contents: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        })
        if(!partner){
            throw new NotFoundException(`Партнер не найден`);
        }
        return partner;
    }

    async update(id: string, updatePartnerDto: UpdatePartnerDto){
        try {
            return await this.prisma.partner.update({
                where:{ id },
                data: updatePartnerDto,
            })
        } catch  {
            throw new NotFoundException("Партнер не найден")
        }
    }

    async delete(id: string){
        try {
            return await this.prisma.partner.delete({
                where: { id },
            })
        }catch {
            throw new NotFoundException("Партнер не найден")
        }
    }
}
