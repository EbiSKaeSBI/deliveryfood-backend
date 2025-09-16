import { PartialType } from "@nestjs/mapped-types";
import {CreatePartnerDto} from "./create-partner.dto";
import {IsEnum, IsNumber, IsOptional, IsString, Min} from "class-validator";
import {KitchenType} from "@prisma/client";




export class UpdatePartnerDto extends PartialType(CreatePartnerDto){
    @IsString()
    @IsOptional()
    name?: string;

    @IsNumber()
    @Min(1)
    @IsOptional()
    timeOfDelivery?: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    stars?: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    minPrice?: number;

    @IsEnum(KitchenType)
    @IsOptional()
    kitchen?: KitchenType;

    @IsString()
    @IsOptional()
    image?: string;

    @IsString()
    @IsOptional()
    productsFile?: string;

}