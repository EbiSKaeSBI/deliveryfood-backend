import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {DeliveriesService} from "./deliveries.service";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {CreateDeliveryDto} from "./dto/create-deliveries.dto";
import {GetUser} from "../auth/decorators/get-user.decorator";
import {UpdateDeliveryDto} from "./dto/update-deliveries.dto";

@Controller('deliveries')
export class DeliveriesController {
    constructor(private deliveryService: DeliveriesService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createDeliveryDto: CreateDeliveryDto, @GetUser() user: any) {
        // Автоматически подставляем userId из аутентифицированного пользователя
        const deliveryData = {
            ...createDeliveryDto,
            userId: user.id,
        };
        return this.deliveryService.create(deliveryData);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll() {
        return this.deliveryService.findAll();
    }

    @Get('my')
    @UseGuards(JwtAuthGuard)
    my(@GetUser() user: any) {
        return this.deliveryService.findByUser(user.id);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    findOne(@Param('id') id: string) {
        return this.deliveryService.findOne(id);
    }

    @Patch(":id")
    @UseGuards(JwtAuthGuard)
    update(@Param('id') id: string,@Body() updateDeliveryDto: UpdateDeliveryDto) {
        return this.deliveryService.update(id, updateDeliveryDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string) {
        return this.deliveryService.delete(id);
    }
}
