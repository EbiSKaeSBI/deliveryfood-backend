import {IsArray, IsEnum, IsNumber, IsOptional, IsString, Min, ValidateNested} from "class-validator";
import {DeliveryStatus} from "@prisma/client";
import {Type} from "class-transformer";


class DeliveryContentDto {
    @IsString()
    @IsOptional()
    productId?: string;

    @IsString()
    productName: string;

    @IsNumber()
    @Min(1)
    quantity: number;

    @IsNumber()
    @Min(0)
    price: number;
}


export class CreateDeliveryDto {
    @IsString()
    @IsOptional()
    userId?: string;

    @IsString()
    @IsOptional()
    partnerId?: string;

    @IsEnum(DeliveryStatus)
    @IsOptional()
    status?: DeliveryStatus;

    @IsNumber()
    totalAmount: number;

    @IsString()
    address: string;

    @IsString()
    phone: string;

    @IsString()
    @IsOptional()
    comment?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DeliveryContentDto)
    contents: DeliveryContentDto[];
}