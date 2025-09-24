import {Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Req, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {RegisterDto} from "./dto/register.dto";
import {LoginDto} from "./dto/login.dto";
import {JwtAuthGuard} from "./guards/jwt-auth.guard";
import {GetUser} from "./decorators/get-user.decorator";
import {UserRole} from "@prisma/client";
import {RolesGuard} from "../roles/guards/roles.guard";
import {Roles} from "../roles/decorators/roles.decorator";
import {UpdateProfileDto} from "./dto/update.dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("register")
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto, UserRole.USER);
    }

    @Post("login")
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post("refresh")
    @HttpCode(HttpStatus.OK)
    async refresh(@Body("refreshToken") refreshToken: string) {
        return this.authService.refreshTokens(refreshToken);
    }

    @Post("logout")
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async logout(@Body("refreshToken") refreshToken: string) {
        return this.authService.logout(refreshToken);
    }

    @Get("profile")
    @UseGuards(JwtAuthGuard)
    getProfile(@GetUser() user: any) {
        return user
    }

    @Patch("profile")
    @UseGuards(JwtAuthGuard)
    updateProfile(@Req() req: any, @Body() updateProfileDto: UpdateProfileDto) {
        const userId = req.user.id
        return this.authService.updateProfile(userId, updateProfileDto);
    }


    @Post("register/admin")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async registerAdmin(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto, UserRole.ADMIN);
    }
}
