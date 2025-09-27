import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {CreatePartnerDto} from "./dto/create-partner.dto";
import {UpdatePartnerDto} from "./dto/update-partner.dto";
import {Prisma} from "@prisma/client";

interface FindAllOptions {
    search?: string;
    page?: number;
    limit?: number;
}

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

    async findAll({search, page = 1, limit = 9}: FindAllOptions = {}) {
        const where: Prisma.PartnerWhereInput | undefined = search ? {
            OR: [
                {
                    name: {
                        contains: search,
                        mode: "insensitive" as Prisma.QueryMode
                    }
                }
            ]
        } : undefined;

        if (search) {
            const partners = await this.prisma.partner.findMany({
                where,
                include: {
                    products: true,
                    deliveries: true,
                },
                orderBy: {
                    name: "asc"
                }
            });
            const totalCount = partners.length;
            return {
                data: partners,
                pagination: {
                    currentPage: 1,
                    totalPage: 1,
                    totalCount,
                    hasNextPage: false,
                    hasPreviousPage: false,
                    nextPage: null,
                    previousPage: null,
                }
            };
        }

        const skip = (page - 1) * limit;
        const take = limit;

        const [partners, totalCount] = await Promise.all([
            this.prisma.partner.findMany({
                where,
                skip,
                take,
                include: {
                    products: true,
                    deliveries: true,
                },
                orderBy: {
                    name: "asc"
                }
            }),
            this.prisma.partner.count({where})
        ]);
        const totalPage = Math.ceil(totalCount / limit);
        const hasNextPage = page < totalPage;
        const hasPreviousPage = page > 1;
        return {
            data: partners,
            pagination: {
                currentPage: page,
                totalPage,
                totalCount,
                hasNextPage,
                hasPreviousPage,
                nextPage: hasNextPage ? page + 1 : null,
                previousPage: hasPreviousPage ? page - 1 : null,
            }
        };
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
