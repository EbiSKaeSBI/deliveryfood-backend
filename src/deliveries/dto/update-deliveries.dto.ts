import {IsEnum, IsNumber, IsOptional, IsString} from "class-validator";
import {PartialType} from "@nestjs/mapped-types";
import {DeliveryStatus} from "@prisma/client";
import {CreateDeliveryDto} from "./create-deliveries.dto";

export class UpdateDeliveryDto extends PartialType(CreateDeliveryDto) {
    @IsEnum(DeliveryStatus)
    @IsOptional()
    status?: DeliveryStatus;
}