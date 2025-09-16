import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { KitchenType } from '@prisma/client';

export class CreatePartnerDto {
    @IsString()
    name: string;

    @IsNumber()
    @Min(1)
    timeOfDelivery: number;

    @IsNumber()
    @Min(0)
    stars: number;

    @IsNumber()
    @Min(0)
    minPrice: number;

    @IsEnum(KitchenType)
    kitchen: KitchenType;

    @IsString()
    image: string;
}