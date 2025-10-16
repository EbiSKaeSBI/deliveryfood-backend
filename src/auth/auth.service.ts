import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
    NotFoundException, BadRequestException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from "../prisma/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import {UserRole} from "@prisma/client";
import {UpdateProfileDto} from "./dto/update.dto";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) {}

    async register(registerDto: RegisterDto, role: UserRole = UserRole.USER) {
        const { email, name, password, phone } = registerDto;

        try {
            const existingUser = await this.prisma.user.findUnique({
                where: { email: email.toLowerCase().trim() }
            });

            if (existingUser) {
                throw new ConflictException("Пользователь с таким email уже существует");
            }

            const hashedPassword = await this.hashPassword(password);

            const user = await this.prisma.user.create({
                data: {
                    email: email.toLowerCase().trim(),
                    name: name.trim(),
                    phone: phone?.trim(),
                    password: hashedPassword,
                    role: role,
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    phone: true,
                    role: true,
                    createdAt: true,
                },
            });

            const tokens = await this.generateTokens(user);

            return {
                message: "Пользователь успешно зарегистрирован",
                user,
                ...tokens
            };

        } catch(error) {
            if(error instanceof ConflictException) {
                throw error;
            }
            throw new InternalServerErrorException("Ошибка регистрации");
        }
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        const user = await this.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException("Неверный email или пароль");
        }

        const tokens = await this.generateTokens(user);

        return {
            message: "Успешный вход в систему",
            user,
            ...tokens
        };
    }

    async logout() {
        return { message: "Успешный выход из системы" };
    }

    async refreshTokens(refreshToken: string) {
        try {

            const payload = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET
            });


            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    phone: true,
                    role: true,
                    createdAt: true,
                },
            });

            if (!user) {
                throw new UnauthorizedException("Пользователь не найден");
            }

            // Генерируем новые токены
            const tokens = await this.generateTokens(user);

            return {
                message: "Токены успешно обновлены",
                ...tokens
            };

        } catch (error) {
            throw new UnauthorizedException("Недействительный refresh token");
        }
    }

    async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
        const { name, phone, email, currentPassword, newPassword } = updateProfileDto;

        try {


            const user = await this.prisma.user.findUnique({
                where: { id: userId }
            });

            if (!user) {
                throw new NotFoundException("Пользователь не найден");
            }

            const updateData: any = {};

            if (name !== "") {
                updateData.name = name.trim();
            }



            if (phone !== "") {
                updateData.phone = phone?.trim();
            }

            if (email !== "" && email !== user.email) {
                const emailExists = await this.prisma.user.findUnique({
                    where: { email: email.toLowerCase().trim() }
                });

                if (emailExists) {
                    throw new ConflictException("Пользователь с таким email уже существует");
                }

                updateData.email = email.toLowerCase().trim();
            }

            if (newPassword) {
                if (!currentPassword) {
                    throw new BadRequestException("Текущий пароль обязателен для смены пароля");
                }

                const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
                if (!isCurrentPasswordValid) {
                    throw new UnauthorizedException("Неверный текущий пароль");
                }

                updateData.password = await this.hashPassword(newPassword);
            }

            if (Object.keys(updateData).length === 0) {
                throw new BadRequestException("Нет данных для обновления");
            }

            const updatedUser = await this.prisma.user.update({
                where: { id: userId },
                data: updateData,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    phone: true,
                    role: true,
                    createdAt: true,
                },
            });

            return {
                message: "Профиль успешно обновлен",
                user: updatedUser
            };

        } catch (error) {
            console.error('Error in updateProfile:', error);

            if (error instanceof ConflictException ||
                error instanceof UnauthorizedException ||
                error instanceof BadRequestException ||
                error instanceof NotFoundException) {
                throw error;
            }

            if (error.code === 'P2025') {
                throw new NotFoundException("Пользователь не найден");
            }

            throw new InternalServerErrorException(`Ошибка обновления профиля: ${error.message}`);
        }
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (user && await bcrypt.compare(password, user.password)) {
            const { password: _, ...result } = user;
            return result;
        }
        return null;
    }

    private async generateTokens(user: any) {
        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role
        };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_ACCESS_SECRET,
                expiresIn: '1d'
            }),
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: '7d'
            })
        ]);

        return { accessToken, refreshToken };
    }

    private async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }

    async findById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                deliveries: true,
                createdAt: true,
            },
        });

        if (!user) {
            throw new NotFoundException("Пользователь не найден");
        }

        return user;
    }

    async getProfile(userId: string) {
        return this.findById(userId);
    }


    async verifyAccessToken(token: string) {
        try {
            const payload = this.jwtService.verify(token, {
                secret: process.env.JWT_ACCESS_SECRET
            });


            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
                select: { id: true, email: true, role: true }
            });

            if (!user) {
                throw new UnauthorizedException("Пользователь не найден");
            }

            return payload;
        } catch (error) {
            throw new UnauthorizedException("Недействительный access token");
        }
    }
}