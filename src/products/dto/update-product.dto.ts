import {PartialType} from "@nestjs/mapped-types";
import {CreateProductDto} from "./create-product.dto";
import {IsNumber, IsOptional, IsString, Min} from "class-validator";


export class UpdateProductDto extends PartialType(CreateProductDto){
    @IsString()
    @IsOptional()
    partnerId?: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @Min(0)
    @IsOptional()
    price?: number;

    @IsString()
    @IsOptional()
    image?: string;
}